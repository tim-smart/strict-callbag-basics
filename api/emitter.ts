import { Signal, Sink } from "strict-callbag"

export interface Emitter<A, E> {
  data(a: A): void
  error(e: E): void
  end(): void
}

export const emitter = <A, E>(sink: Sink<A, E>): Emitter<A, E> => ({
  data(a) {
    sink(Signal.DATA, a)
  },
  error(e) {
    sink(Signal.END, e)
  },
  end() {
    sink(Signal.END, undefined)
  },
})
