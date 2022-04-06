import { Signal, Source, Talkback } from "strict-callbag"

interface Callbacks<A, E> {
  onStart: (this: void) => void
  onData: (this: void, data: A) => void
  onEnd: (this: void, err?: E) => void

  talkbackOverride?: (original: Talkback<any>) => Talkback<any>
}

export const subscribe = <A, E>(
  source: Source<A, E>,
  { onStart, onData, onEnd, talkbackOverride }: Callbacks<A, E>,
) => {
  let started = false
  let aborted = false
  let pullPending = false
  let talkback: Talkback<any>
  let onCancel: (() => void) | undefined
  let waitingForData = false

  const listen = () => {
    if (started) return
    started = true

    return source(Signal.START, (signal, data) => {
      if (aborted) {
        if (signal === Signal.START) {
          data(Signal.END)
          onCancel?.()
        }
        return
      }

      if (signal === Signal.START) {
        talkback = talkbackOverride ? talkbackOverride(data) : data
        if (pullPending) {
          talkback(Signal.DATA)
        }

        onStart()
      } else if (signal === Signal.DATA) {
        waitingForData = false
        onData(data)
      } else if (signal === Signal.END) {
        aborted = true
        onEnd(data)
      }
    })
  }

  const cancel = (cb?: () => void) => {
    if (aborted) return

    aborted = true
    onCancel = cb

    if (talkback) {
      talkback(Signal.END)
      onCancel?.()
    }
  }

  const pull = () => {
    if (aborted) return

    waitingForData = true

    if (talkback) {
      talkback(Signal.DATA)
    } else {
      pullPending = true
    }
  }

  const waiting = () => waitingForData

  return { listen, cancel, pull, waiting }
}

export type Subscription = ReturnType<typeof subscribe>
