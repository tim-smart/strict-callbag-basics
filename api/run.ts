import { Signal, Sink, Source, Talkback } from "strict-callbag"
import { createPipe } from "./createPipe"

const noop = (): Sink<any, any, never> => {
  let talkback: Talkback<never>

  return (signal, data) => {
    if (signal === Signal.START) {
      talkback = data
      talkback(Signal.DATA)
    } else if (signal === Signal.DATA) {
      talkback(Signal.DATA)
    }
  }
}

export const run_ = <A, E, EO>(
  self: Source<A, E>,
  sink: Sink<A, E, EO> = noop(),
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
  <A, E, EO>(sink?: Sink<A, E, EO>) =>
  (self: Source<A, E>) =>
    run_(self, sink)
