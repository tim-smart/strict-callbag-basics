import { Signal, Source } from "strict-callbag"

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

    register({
      data,
      end,
      error,
    })

    sink(Signal.START, (t) => {
      if (t === Signal.END) {
        completed = true
      }
    })
  }
