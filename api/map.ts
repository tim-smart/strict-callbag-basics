import Map from "callbag-map";
import { Source } from "strict-callbag";

export const map_ = <A, E, B>(
  self: Source<A, E>,
  f: (a: A) => B
): Source<B, E> => Map(f)(self as any) as any;

export const map =
  <A, B>(f: (a: A) => B) =>
  <E>(self: Source<A, E>) =>
    map_(self, f);
