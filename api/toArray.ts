import { Signal, Source } from "strict-callbag"
import { createPipe } from "./createPipe"

export const toArray =
  <A, E>(self: Source<A, E>): Source<A[], E> =>
  (_, sink) => {
    let array: A[] = []

    createPipe(self, sink, {
      onStart(s) {
        s.pull()
      },
      onRequest() {},
      onData(s, data) {
        array.push(data)
        s.pull()
      },
      onEnd(err) {
        if (err) {
          sink(Signal.END, err)
        } else {
          sink(Signal.DATA, array)
          sink(Signal.END, undefined)
        }
      },
      onAbort() {
        array = []
      },
    })
  }
