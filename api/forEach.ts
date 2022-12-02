import { Source } from "strict-callbag"
import { run_ } from "./run.js"
import { tap_ } from "./tap.js"

export const forEach_ = <A, E>(self: Source<A, E>, f: (a: A) => any) =>
  run_(tap_(self, f))

export const forEach =
  <A>(f: (a: A) => any) =>
  <E>(self: Source<A, E>) =>
    forEach_(self, f)
