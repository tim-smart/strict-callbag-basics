import { Signal, Sink, Source, Talkback } from "strict-callbag"
import { emitter, Emitter } from "./emitter"
import { share } from "./share"

type Cleanup = () => void

type Register<E, A> = (sink: Sink<A, E>) => Cleanup | void

/**
 * Create a push based stream using the given sink
 */
export const async =
  <A, E = unknown>(register: Register<E, A>): Source<A, E> =>
  (_, sink) => {
    let completed = false
    let cleanup: Cleanup | void
    let talkback: Talkback<never> | undefined

    const complete = () => {
      completed = true
      cleanup?.()
    }

    sink(Signal.START, (t) => {
      talkback?.(t)

      if (t === Signal.END) {
        complete()
      }
    })

    cleanup = register((signal, data) => {
      if (completed) throw new Error("sink ended")

      if (signal === Signal.START) {
        talkback = data
      } else if (signal === Signal.DATA) {
        sink(Signal.DATA, data)
      } else if (signal === Signal.END) {
        complete()
        sink(Signal.END, data)
      }
    })

    if (completed && cleanup) {
      cleanup()
    }
  }

export const asyncSink = <A, E = unknown>(): readonly [
  sink: Sink<A, E>,
  source: Source<A, E>,
] => {
  let buffer: A[] = []
  let completed = false
  let completedError: E | undefined
  let sink: Sink<A, E, unknown> | undefined
  let parentTalkback: Talkback<never> | undefined

  const parentSink: Sink<A, E> = (signal, data) => {
    if (completed) throw new Error("sink ended")

    if (signal === Signal.START) {
      parentTalkback = data
    } else if (signal === Signal.DATA) {
      if (sink) {
        sink(Signal.DATA, data)
      } else {
        buffer.push(data)
      }
    } else if (signal === Signal.END) {
      completed = true
      completedError = data
      sink?.(Signal.END, data)
    }
  }

  const source: Source<A, E> = (_, data) => {
    sink = data

    sink(Signal.START, (signal) => {
      parentTalkback?.(signal)

      if (signal === Signal.END) {
        sink = undefined
      }
    })

    for (const item of buffer) {
      sink(Signal.DATA, item)
    }
    buffer = []

    if (completed) {
      data(Signal.END, completedError)
      return
    }
  }

  return [parentSink, share(source)]
}

export const asyncEmitter = <A, E = unknown>(): readonly [
  sink: Emitter<A, E>,
  source: Source<A, E>,
] => {
  const [sink, source] = asyncSink<A, E>()
  return [emitter(sink), source]
}
