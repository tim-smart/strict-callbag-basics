import { Source } from "strict-callbag"
import { createPipe } from "./createPipe"

export const batchCount_ =
  <A, E>(self: Source<A, E>, batchSize: number): Source<A[], E> =>
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
        buffer.push(data)

        if (buffer.length >= batchSize) {
          sink(1, buffer)
          buffer = []
        } else {
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

export const batchCount =
  (batchSize: number) =>
  <A, E>(self: Source<A, E>) =>
    batchCount_(self, batchSize)
