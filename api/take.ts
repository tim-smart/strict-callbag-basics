import cbTake from "callbag-take"
import { Source } from "strict-callbag"

export const take_ = <A, E>(self: Source<A, E>, max: number): Source<A, E> =>
  (cbTake as any)(max)(self)

export const take =
  (max: number) =>
  <A, E>(self: Source<A, E>) =>
    take_(self, max)
