import { Signal, Source } from "strict-callbag"
import { createPipe } from "./createPipe"

export const batchUntil_ =
  <A, E>(
    self: Source<A, E>,
    predicate: (value: A) => boolean,
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
        if (predicate(data)) {
          if (buffer.length > 0) {
            sink(Signal.DATA, buffer)
          }

          buffer = [data]
        } else {
          buffer.push(data)
          s.pull()
        }
      },
      onEnd(err) {
        if (buffer.length > 0) {
          sink(Signal.DATA, buffer)
          buffer = []
        }

        sink(Signal.END, err)
      },
      onAbort() {
        buffer = []
      },
    })
  }

export const batchUntil =
  <A>(predicate: (value: A) => boolean) =>
  <E>(self: Source<A, E>) =>
    batchUntil_(self, predicate)
