import { Signal, Source } from "strict-callbag"

export const error =
  <E>(e: E): Source<never, E> =>
  (_, sink) => {
    let disposed = false

    sink(Signal.START, (end) => {
      if (end !== Signal.END) return
      disposed = true
    })

    if (disposed) return

    sink(Signal.END, e)
  }
