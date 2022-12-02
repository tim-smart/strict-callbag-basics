import { Source } from "strict-callbag"
import { NONE } from "./none.js"
import { subscribe, Subscription } from "./subscribe.js"

export const repeatWhile_ =
  <A, E>(
    self: Source<A, E>,
    predicate: (index: number, lastItem: A | NONE) => boolean,
  ): Source<A, E> =>
  (_, sink) => {
    let waitingForData = false
    let subscription: Subscription | undefined

    const resubscribe = (index: number) => {
      let lastItem: A | NONE = NONE

      const sub = subscribe(self, {
        onStart() {
          if (waitingForData) {
            sub.pull()
          }
        },
        onData(data) {
          waitingForData = false
          lastItem = data

          sink(1, data)
        },
        onEnd(err) {
          if (err) {
            sink(2, err)
          } else if (predicate(index, lastItem)) {
            resubscribe(index + 1)
            subscription!.listen()
          } else {
            sink(2, undefined)
          }
        },
      })

      subscription = sub
    }

    sink(0, (signal) => {
      if (signal === 1) {
        waitingForData = true

        if (!subscription) {
          resubscribe(0)
          subscription!.listen()
        } else {
          subscription.pull()
        }
      } else if (signal === 2) {
        subscription!.cancel()
      }
    })
  }

export const repeatWhile =
  <A>(predicate: (index: number, lastItem: A | NONE) => boolean) =>
  <E>(self: Source<A, E>): Source<A, E> =>
    repeatWhile_(self, predicate)
