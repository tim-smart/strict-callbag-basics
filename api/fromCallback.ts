import { Source } from "strict-callbag"

export type Callback<A, E> = (
  err: E | undefined | null,
  data?: A | null,
) => void

export const fromCallback =
  <A, E = unknown>(f: (cb: Callback<A, E>) => unknown): Source<A, E> =>
  (_, sink) => {
    let running = false
    let aborted = false

    const cb: Callback<A, E> = (err, data) => {
      if (aborted) return

      if (err) {
        sink(2, err)
      } else {
        if (data) {
          sink(1, data)
        }
        sink(2, undefined)
      }
    }

    sink(0, (signal) => {
      if (signal === 1) {
        if (running) return
        running = true
        f(cb)
      } else if (signal === 2) {
        aborted = true
      }
    })
  }
