import { Source } from "strict-callbag"
import { createPipe } from "./createPipe.js"

export const batchUntil_ =
  <A, E>(
    self: Source<A, E>,
    predicate: (value: A) => boolean,
    inclusive = false,
  ): Source<A[], E> =>
  (_, sink) => {
    let buffer: A[] = []

    createPipe(self, sink, {
      onStart(s) {
        s.pull()
      },
      onRequest(s) {
        s.pull()
      },
      onData(s, data) {
        if (predicate(data) && (inclusive || buffer.length > 0)) {
          if (inclusive) {
            buffer.push(data)
            sink(1, buffer)
            buffer = []
          } else {
            sink(1, buffer)
            buffer = [data]
          }
        } else {
          buffer.push(data)
          s.pull()
        }
      },
      onEnd(err) {
        if (buffer.length > 0) {
          sink(1, buffer)
          buffer = []
        }

        sink(2, err)
      },
      onAbort() {
        buffer = []
      },
    })
  }

export const batchUntil =
  <A>(predicate: (value: A) => boolean, inclusive?: boolean) =>
  <E>(self: Source<A, E>) =>
    batchUntil_(self, predicate, inclusive)
