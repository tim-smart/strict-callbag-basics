import cbTakeWhile from "callbag-take-while"
import { Source } from "strict-callbag"

export const takeWhile_ = <A, E>(
  self: Source<A, E>,
  predicate: (a: A) => boolean,
): Source<A, E> => cbTakeWhile(predicate)(self as any) as any

export const takeWhile =
  <A>(predicate: (a: A) => boolean) =>
  <E>(self: Source<A, E>) =>
    takeWhile_(self, predicate)
