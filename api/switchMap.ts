// ets_tracing: off
import { Signal, Source } from "strict-callbag"
import { createPipe } from "./createPipe"
import { subscribe, Subscription } from "./subscribe"

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
            sink(Signal.DATA, data)
          },

          onEnd(err) {
            innerSub = undefined

            if (sourceEnded) {
              sink(Signal.END, err ?? sourceError)
              return
            }

            if (err) {
              outerSub.cancel()
              sink(Signal.END, err)
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
          sink(Signal.END, err)
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
