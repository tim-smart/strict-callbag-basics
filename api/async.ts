import { Signal, Sink, Source } from "strict-callbag"
import { share } from "./share"

export interface AsyncEmitter<E, A> {
  data: (data: A) => void
  error: (error: E) => void
  end: () => void
}

type Register<E, A> = (emitter: AsyncEmitter<E, A>) => void

/**
 * Create a push based stream using the register callbacks
 */
export const async =
  <A, E = unknown>(register: Register<E, A>): Source<A, E> =>
  (_, sink) => {
    let completed = false

    const data = (data: A) => {
      if (completed) return
      sink(Signal.DATA, data)
    }

    const error = (error: E) => {
      if (completed) return
      completed = true
      sink(Signal.END, error)
    }

    const end = () => {
      if (completed) return
      completed = true
      sink(Signal.END, undefined)
    }

    sink(Signal.START, (t) => {
      if (t === Signal.END) {
        completed = true
      }
    })

    register({
      data,
      end,
      error,
    })
  }

export const asyncEmitter = <A, E = unknown>(): readonly [
  emitter: AsyncEmitter<E, A>,
  source: Source<A, E>,
] => {
  let buffer: A[] = []
  let completed = false
  let completedError: E | undefined
  let sink: Sink<A, E, unknown> | undefined

  const data = (data: A) => {
    if (completed) return

    if (sink) {
      sink(Signal.DATA, data)
    } else {
      buffer.push(data)
    }
  }

  const error = (error: E) => {
    if (completed) return
    completed = true
    completedError = error

    sink?.(Signal.END, error)
  }

  const end = () => {
    if (completed) return
    completed = true

    sink?.(Signal.END, undefined)
  }

  const source: Source<A, E> = (_, data) => {
    sink = data

    sink(Signal.START, (signal) => {
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

  return [{ data, error, end }, share(source)]
}
