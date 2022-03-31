import cbConcat from "callbag-concat"
import { Source } from "strict-callbag"

export const concat_ = <A, B, E, E1>(
  self: Source<A, E>,
  other: Source<B, E1>,
): Source<A | B, E | E1> => (cbConcat as any)(self, other)

export const concat =
  <B, E1>(other: Source<B, E1>) =>
  <A, E>(self: Source<A, E>) =>
    concat_(self, other)
