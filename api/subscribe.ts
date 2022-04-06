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
  let pendingPulls = 0
  let talkback: Talkback<any>
  let onCancel: (() => void) | undefined

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
        onStart()

        if (pendingPulls > 0) {
          talkback(Signal.DATA)
        }
      } else if (signal === Signal.DATA) {
        onData(data)

        if (pendingPulls > 0) pendingPulls--
        if (pendingPulls > 0) {
          talkback(Signal.DATA)
        }
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

    pendingPulls++

    if (talkback && pendingPulls === 1) {
      talkback(Signal.DATA)
    }
  }

  return { listen, cancel, pull }
}

export type Subscription = ReturnType<typeof subscribe>
