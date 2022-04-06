import { Signal, Source } from "strict-callbag"

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
        sink(Signal.END, err)
      } else {
        if (data) {
          sink(Signal.DATA, data)
        }
        sink(Signal.END, undefined)
      }
    }

    sink(Signal.START, (signal) => {
      if (signal === Signal.DATA) {
        if (running) return
        running = true
        f(cb)
      } else if (signal === Signal.END) {
        aborted = true
      }
    })
  }
