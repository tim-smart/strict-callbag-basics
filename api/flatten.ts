import Flatten from "callbag-flatten"
import { Source } from "strict-callbag"

export const flatten = <A, E, E1>(
  self: Source<Source<A, E1>, E>,
): Source<A, E | E1> => (Flatten as any)(self)
