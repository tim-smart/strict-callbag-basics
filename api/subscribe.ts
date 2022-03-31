import { Signal, Source, Talkback } from "strict-callbag"

interface Callbacks<A, E> {
  onStart: () => void
  onData: (data: A) => void
  onEnd: (err?: E) => void

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

        while (--pendingPulls > 0) {
          talkback(Signal.DATA)
        }
      } else if (signal === Signal.DATA) {
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

    if (talkback) {
      talkback(Signal.DATA)
    } else {
      pendingPulls++
    }
  }

  return { listen, cancel, pull }
}

export type Subscription = ReturnType<typeof subscribe>
