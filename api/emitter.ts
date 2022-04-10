import { Sink } from "strict-callbag"

export interface Emitter<A, E> {
  data(this: void, a: A): void
  error(this: void, e: E): void
  end(this: void): void
}

export const emitter = <A, E>(sink: Sink<A, E>): Emitter<A, E> => ({
  data(a) {
    sink(1, a)
  },
  error(e) {
    sink(2, e)
  },
  end() {
    sink(2, undefined)
  },
})
