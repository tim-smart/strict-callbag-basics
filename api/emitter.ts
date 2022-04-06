import { Signal, Sink } from "strict-callbag"

export interface Emitter<A, E> {
  data(this: void, a: A): void
  error(this: void, e: E): void
  end(this: void): void
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
