import cbScan from "callbag-scan"
import { Source } from "strict-callbag"

export const scan_ = <A, B, E>(
  self: Source<A, E>,
  reducer: (acc: B, item: A) => B,
  seed?: B,
): Source<B, E> => (cbScan as any)(reducer, seed)(self)

export const scan =
  <A, B>(reducer: (acc: B, item: A) => B, seed?: B) =>
  <E>(self: Source<A, E>) =>
    scan_(self, reducer, seed)
