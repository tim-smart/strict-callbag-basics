import { Source } from "strict-callbag"
import { flatten } from "./flatten.js"
import { map_ } from "./map.js"

export const chain_ = <A, B, E, E1>(
  self: Source<A, E>,
  fab: (a: A) => Source<B, E1>,
): Source<B, E | E1> => flatten(map_(self, fab))

export const chain =
  <A, B, E1>(fab: (a: A) => Source<B, E1>) =>
  <E>(self: Source<A, E>): Source<B, E | E1> =>
    chain_(self, fab)
