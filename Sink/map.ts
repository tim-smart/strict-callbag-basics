import { Sink } from "strict-callbag"

export const map_ =
  <A, B, EI, EO>(self: Sink<A, EI, EO>, f: (b: B) => A): Sink<B, EI, EO> =>
  (signal, data) => {
    if (signal === 1) {
      self(1, f(data))
    } else {
      self(signal, data as any) // eslint-disable-line
    }
  }

export const map =
  <A, B>(f: (b: B) => A) =>
  <EI, EO>(self: Sink<A, EI, EO>) =>
    map_(self, f)
