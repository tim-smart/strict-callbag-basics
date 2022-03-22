import { Signal, Source } from "strict-callbag"
import { createPipe } from "./createPipe"

export const delay_ =
  <A, E>(self: Source<A, E>, delayMs: number): Source<A, E> =>
  (_, sink) => {
    let sourceEnded = false
    let sourceError: E | undefined
    let timeouts = new Set<NodeJS.Timeout>()

    function cleanup() {
      timeouts.forEach((t) => {
        clearTimeout(t)
      })
      timeouts.clear()
    }

    function maybeEnd() {
      if (sourceEnded && timeouts.size === 0) {
        sink(Signal.END, sourceError)
      }
    }

    createPipe(self, sink, {
      onStart(s) {
        s.pull()
      },
      onRequest(s) {
        s.pull()
      },
      onData(_s, data) {
        const timeout = setTimeout(() => {
          timeouts.delete(timeout)
          sink(Signal.DATA, data)
          maybeEnd()
        }, delayMs)
        timeouts.add(timeout)
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

export const delay =
  (delayMs: number) =>
  <A, E>(self: Source<A, E>) =>
    delay_(self, delayMs)
