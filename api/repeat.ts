import { Source } from "strict-callbag"
import { repeatWhile_ } from "./repeatWhile"

export const repeat_ = <A, E>(
  self: Source<A, E>,
  count: number,
): Source<A, E> => repeatWhile_(self, (index) => index < count)

export const repeat =
  (count: number) =>
  <A, E>(self: Source<A, E>): Source<A, E> =>
    repeat_(self, count)
