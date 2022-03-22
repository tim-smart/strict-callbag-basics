import { Signal, Source } from "strict-callbag"

export const fromPromise_ =
  <A, E = unknown>(
    f: () => Promise<A>,
    onError: (e: unknown) => E,
  ): Source<A, E> =>
  (_, sink) => {
    let promise: Promise<unknown> | undefined
    let aborted = false

    sink(Signal.START, (signal) => {
      if (signal === Signal.DATA) {
        if (promise) return

        try {
          promise = f()
            .then((a) => {
              if (aborted) return
              sink(Signal.DATA, a)
              sink(Signal.END, undefined)
            })
            .catch((err) => {
              if (aborted) return
              sink(Signal.END, onError(err))
            })
        } catch (err) {
          sink(Signal.END, onError(err))
        }
      } else if (signal === Signal.END) {
        aborted = true
      }
    })
  }

export const fromPromise =
  <E>(onError: (e: unknown) => E) =>
  <A>(f: () => Promise<A>): Source<A, unknown> =>
    fromPromise_(f, onError)
