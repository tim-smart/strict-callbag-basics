import { Signal, Source } from "strict-callbag"

export const fromThunk =
  <A>(f: () => A): Source<A, never> =>
  (_, sink) => {
    let unsubed = false

    sink(Signal.START, (signal) => {
      if (signal === Signal.END) {
        unsubed = true
      }
    })

    sink(Signal.DATA, f())

    if (!unsubed) {
      sink(Signal.END, undefined)
    }
  }
