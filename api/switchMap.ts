// ets_tracing: off
import { Source } from "strict-callbag"
import { createPipe } from "./createPipe.js"
import { subscribe, Subscription } from "./subscribe.js"

export const switchMap_ =
  <E, E1, A, B>(
    self: Source<A, E>,
    fab: (a: A) => Source<B, E1>,
  ): Source<B, E | E1> =>
  (_, sink) => {
    let innerSub: Subscription | undefined
    let sourceEnded = false
    let sourceError: E | undefined
    let waitingForData = true

    createPipe(self, sink, {
      onStart(s) {
        s.pull()
      },

      onRequest(s) {
        waitingForData = true

        if (innerSub) {
          innerSub.pull()
        } else {
          s.pull()
        }
      },

      onData(outerSub, data) {
        if (innerSub) {
          innerSub.cancel()
          innerSub = undefined
        }

        const sub = subscribe(fab(data), {
          onStart() {
            sub.pull()
          },

          onData(data) {
            waitingForData = false
            sink(1, data)
          },

          onEnd(err) {
            innerSub = undefined

            if (sourceEnded) {
              sink(2, err ?? sourceError)
              return
            }

            if (err) {
              outerSub.cancel()
              sink(2, err)
            } else if (waitingForData) {
              outerSub.pull()
            }
          },
        })

        sub.listen()
        innerSub = sub
      },

      onEnd(err) {
        sourceEnded = true
        sourceError = err

        if (!innerSub) {
          sink(2, err)
        }
      },

      onAbort() {
        innerSub?.cancel()
      },
    })
  }

/**
 * @ets_data_first switchMap_
 */
export const switchMap =
  <E1, A, B>(fab: (a: A) => Source<B, E1>) =>
  <E>(fa: Source<A, E>): Source<B, E | E1> =>
    switchMap_(fa, fab)
