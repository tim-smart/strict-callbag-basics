import { Source } from "strict-callbag"
import { createPipe } from "./createPipe.js"
import { NONE } from "./none.js"

export const auditTimeP_ =
  <A, E>(self: Source<A, E>, ms: number): Source<A, E> =>
  (_, sink) => {
    let lastItem: A | NONE = NONE
    let timeout: NodeJS.Timeout | undefined

    const cleanup = () => {
      if (timeout) {
        clearTimeout(timeout)
        timeout = undefined
      }
    }

    const maybeEmit = () => {
      if (lastItem !== NONE) {
        const data = lastItem
        lastItem = NONE
        sink(1, data)
      }

      timeout = undefined
    }

    createPipe(self, sink, {
      onStart(s) {
        s.pull()
      },
      onRequest() {
        //
      },
      onData(s, data) {
        lastItem = data

        if (!timeout) {
          timeout = setTimeout(maybeEmit, ms)
        }

        s.pull()
      },
      onEnd(err) {
        cleanup()
        maybeEmit()
        sink(2, err)
      },
      onAbort() {
        cleanup()
      },
    })
  }

export const auditTimeP =
  (ms: number) =>
  <A, E>(self: Source<A, E>) =>
    auditTimeP_(self, ms)
