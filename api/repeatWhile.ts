import { Signal, Source } from "strict-callbag"
import { NONE } from "./none"
import { subscribe, Subscription } from "./subscribe"

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

          sink(Signal.DATA, data)
        },
        onEnd(err) {
          if (err) {
            sink(Signal.END, err)
          } else if (predicate(index, lastItem)) {
            resubscribe(index + 1)
            subscription!.listen()
          } else {
            sink(Signal.END, undefined)
          }
        },
      })

      subscription = sub
    }

    sink(Signal.START, (signal) => {
      if (signal === Signal.DATA) {
        waitingForData = true

        if (!subscription) {
          resubscribe(0)
          subscription!.listen()
        } else {
          subscription.pull()
        }
      } else if (signal === Signal.END) {
        subscription!.cancel()
      }
    })
  }

export const repeatWhile =
  <A>(predicate: (index: number, lastItem: A | NONE) => boolean) =>
  <E>(self: Source<A, E>): Source<A, E> =>
    repeatWhile_(self, predicate)
