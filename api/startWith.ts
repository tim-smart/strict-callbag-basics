import StartWith from "callbag-start-with"
import { Source } from "strict-callbag"
import "../modules"

export const startWith = StartWith
export const startWith_ = <A, B, E>(self: Source<A, E>, ...bs: B[]) =>
  startWith(...bs)(self)
