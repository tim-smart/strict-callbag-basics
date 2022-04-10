import { Source } from "strict-callbag"

export const fromPromise_ =
  <A, E = unknown>(
    f: () => Promise<A>,
    onError: (e: unknown) => E,
  ): Source<A, E> =>
  (_, sink) => {
    let promise: Promise<unknown> | undefined
    let aborted = false

    sink(0, (signal) => {
      if (signal === 1) {
        if (promise) return

        try {
          promise = f()
            .then((a) => {
              if (aborted) return
              sink(1, a)
              sink(2, undefined)
            })
            .catch((err) => {
              if (aborted) return
              sink(2, onError(err))
            })
        } catch (err) {
          sink(2, onError(err))
        }
      } else if (signal === 2) {
        aborted = true
      }
    })
  }

export const fromPromise =
  <E>(onError: (e: unknown) => E) =>
  <A>(f: () => Promise<A>): Source<A, unknown> =>
    fromPromise_(f, onError)
