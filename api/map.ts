import { Source } from "strict-callbag"

export const map_ = <A, E, B>(
  self: Source<A, E>,
  f: (a: A, index: number) => B,
): Source<B, E> => map(f)(self as any) as any

export const map =
  <A, B>(f: (a: A, index: number) => B) =>
  <E>(source: Source<A, E>): Source<B, E> =>
  (start, sink) => {
    if (start !== 0) return
    let index = 0
    source(0, (t, d) => {
      (sink as any)(t, t === 1 ? f(d, index++) : d)
    })
  }
