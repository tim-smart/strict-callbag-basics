import { Source } from "strict-callbag"
import { createPipe } from "./createPipe"
import { NONE } from "./none"
import { Queue } from "./_internal/queue"

/**
 * Converts any type of stream into a pull based one.
 *
 * `bufferSize` configures the amount of items to keep in the queue
 */
export const buffer_ =
  <A, E>(
    self: Source<A, E>,
    bufferSize: number | undefined = 16,
    eager = false,
  ): Source<A, E> =>
  (_, sink) => {
    let sourceEnded = false
    let sourceError: E | undefined
    let waitingForData = false

    const buffer = new Queue<A>(
      bufferSize === Infinity ? undefined : bufferSize,
    )

    function cleanup() {
      buffer.clear()
    }

    function maybeEnd() {
      if (sourceEnded && buffer.size === 0) {
        sink(2, sourceError)
      }
    }

    createPipe(self, sink, {
      onStart(s) {
        waitingForData = true
        s.pull()
      },
      onRequest(s) {
        const next = buffer.shift()

        if (next === NONE) {
          maybeEnd()

          if (!sourceEnded && (!waitingForData || eager)) {
            waitingForData = true
            s.pull()
          }
        } else {
          sink(1, next)

          if (eager) {
            s.pull()
          }
        }
      },
      onData(_s, data) {
        if (waitingForData) {
          waitingForData = false
          sink(1, data)
        } else {
          buffer.push(data)
        }
      },
      onEnd(err) {
        sourceEnded = true
        sourceError = err
        maybeEnd()
      },
      onAbort() {
        cleanup()
      },
    })
  }

/**
 * Converts any type of stream into a pull based one.
 *
 * `bufferSize` configures the amount of items to keep in the queue
 */
export const buffer =
  (bufferSize?: number, eager?: boolean) =>
  <A, E>(self: Source<A, E>) =>
    buffer_(self, bufferSize, eager)
