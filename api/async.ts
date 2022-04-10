import { Sink, Source, Talkback } from "strict-callbag"
import { emitter, Emitter } from "./emitter"
import { share } from "./share"

type Cleanup = () => void

type Register<E, A> = (sink: Sink<A, E>) => Cleanup | void

export const asyncP =
  <A, E = unknown>(register: Register<E, A>): Source<A, E> =>
  (_, sink) => {
    let completed = false
    let cleanup: Cleanup | void // eslint-disable-line
    let talkback: Talkback<never> | undefined

    const complete = () => {
      completed = true
      cleanup?.()
    }

    sink(0, (t) => {
      talkback?.(t)

      if (t === 2) {
        complete()
      }
    })

    cleanup = register((signal, data) => {
      if (completed) throw new Error("sink ended")

      if (signal === 0) {
        talkback = data
      } else if (signal === 1) {
        sink(1, data)
      } else if (signal === 2) {
        complete()
        sink(2, data)
      }
    })

    if (completed && cleanup) {
      cleanup()
    }
  }

export const asyncSinkP = <A, E = unknown>(): readonly [
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

    if (signal === 0) {
      parentTalkback = data
    } else if (signal === 1) {
      if (sink) {
        sink(1, data)
      } else {
        buffer.push(data)
      }
    } else if (signal === 2) {
      completed = true
      completedError = data
      sink?.(2, data)
    }
  }

  const source: Source<A, E> = (_, data) => {
    sink = data

    sink(0, (signal) => {
      parentTalkback?.(signal)

      if (signal === 2) {
        sink = undefined
      }
    })

    for (const item of buffer) {
      sink(1, item)
    }
    buffer = []

    if (completed) {
      data(2, completedError)
      return
    }
  }

  return [parentSink, share(source)]
}

export const asyncEmitterP = <A, E = unknown>(): readonly [
  sink: Emitter<A, E>,
  source: Source<A, E>,
] => {
  const [sink, source] = asyncSinkP<A, E>()
  return [emitter(sink), source]
}
