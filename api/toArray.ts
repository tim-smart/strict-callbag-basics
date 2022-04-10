import { Source } from "strict-callbag"
import { createPipe } from "./createPipe"

export const toArray =
  <A, E>(self: Source<A, E>): Source<A[], E> =>
  (_, sink) => {
    let array: A[] = []

    createPipe(self, sink, {
      onStart(s) {
        s.pull()
      },
      onRequest() {
        //
      },
      onData(s, data) {
        array.push(data)
        s.pull()
      },
      onEnd(err) {
        if (err) {
          array = []
          sink(2, err)
        } else {
          sink(1, array)
          sink(2, undefined)
        }
      },
      onAbort() {
        array = []
      },
    })
  }
