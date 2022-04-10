import { Source } from "strict-callbag"

export const error =
  <E>(e: E): Source<never, E> =>
  (_, sink) => {
    let disposed = false

    sink(0, (end) => {
      if (end !== 2) return
      disposed = true
    })

    if (disposed) return

    sink(2, e)
  }
