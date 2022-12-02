import { Source } from "strict-callbag"
import { map_ } from "./map.js"

export const tap_ = <A, E>(self: Source<A, E>, f: (a: A) => any) =>
  map_(self, (a) => {
    f(a)
    return a
  })

export const tap =
  <A>(f: (a: A) => any) =>
  <E>(self: Source<A, E>) =>
    tap_(self, f)
