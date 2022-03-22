import { Source } from "strict-callbag"
import { mapError_ } from "./mapError"

export const tapError_ = <A, E>(self: Source<A, E>, f: (e: E) => any) =>
  mapError_(self, (e) => {
    f(e)
    return e
  })

export const tapError =
  <E>(f: (e: E) => any) =>
  <A>(self: Source<A, E>) =>
    tapError_(self, f)
