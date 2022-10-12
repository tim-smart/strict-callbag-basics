import { Signal, Source } from "strict-callbag"

export const fromAsyncIter =
  <A>(iter: AsyncIterable<A>): Source<A> =>
  (_, sink) => {
    let iterable: AsyncIterator<A>
    let pulling = false
    let disposed = false

    sink(Signal.START, (signal) => {
      if (signal === Signal.DATA) {
        if (pulling) return

        iterable ??= iter[Symbol.asyncIterator]()
        pulling = true

        iterable
          .next()
          .then((r) => {
            pulling = false
            if (disposed) return

            if (r.done) {
              if (r.value) {
                sink(Signal.DATA, r.value)
              }
              sink(Signal.END, undefined)
            } else {
              sink(Signal.DATA, r.value)
            }
          })
          .catch((err) => {
            if (disposed) return
            sink(Signal.END, err)
          })
      } else if (signal === Signal.END) {
        disposed = true
      }
    })
  }
