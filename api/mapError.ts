import { Signal, Source } from "strict-callbag"

export const mapError_ =
  <A, E, E1>(self: Source<A, E>, f: (e: E) => E1): Source<A, E1> =>
  (_, sink) => {
    self(Signal.START, (t, d) => {
      if (t === Signal.END && d) {
        sink(t, f(d))
      } else {
        sink(t, d as any)
      }
    })
  }

export const mapError =
  <E, E1>(f: (e: E) => E1) =>
  <A>(self: Source<A, E>) =>
    mapError_(self, f)
