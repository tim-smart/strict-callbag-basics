import { Source } from "strict-callbag"

export const fromThunk =
  <A>(f: () => A): Source<A, never> =>
  (_, sink) => {
    let unsubed = false
    let running = false

    sink(0, (signal) => {
      if (signal === 1) {
        if (!running) {
          running = true
          sink(1, f())
        }

        if (!unsubed) {
          sink(2, undefined as never)
        }
      } else if (signal === 2) {
        unsubed = true
      }
    })
  }
