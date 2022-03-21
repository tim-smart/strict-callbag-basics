import { Signal, Sink, Source } from "strict-callbag"
import { createPipe } from "./createPipe"

export const run_ = <A, E, EO>(
  self: Source<A, E>,
  sink: Sink<A, E, EO>,
): Promise<void> =>
  new Promise((resolve, reject) => {
    createPipe(self, sink, {
      onStart(s) {
        s.pull()
      },
      onRequest(s) {
        s.pull()
      },
      onData(_s, data) {
        sink(Signal.DATA, data)
      },
      onEnd(err) {
        sink(Signal.END, err)

        if (err) {
          reject(err)
        } else {
          resolve()
        }
      },
      onAbort(err) {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      },
    })
  })

export const run =
  <A, E, EO>(sink: Sink<A, E, EO>) =>
  (self: Source<A, E>) =>
    run_(self, sink)
