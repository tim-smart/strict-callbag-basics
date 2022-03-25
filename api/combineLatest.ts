import { Source } from "strict-callbag"
import { zip_ } from "./zip"

export const combineLatest_ = <A, B, E, E1>(
  self: Source<A, E>,
  other: Source<B, E1>,
): Source<readonly [A, B], E | E1> => zip_(self, other, true)

export const combineLatest =
  <B, E1>(other: Source<B, E1>) =>
  <A, E>(self: Source<A, E>) =>
    combineLatest_(self, other)
