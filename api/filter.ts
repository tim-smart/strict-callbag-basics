import Filter from "callbag-filter";
import { Source } from "strict-callbag";

export function filter_<A, E, B extends A>(
  self: Source<A, E>,
  pred: (a: A) => a is B
): Source<B, E>;

export function filter_<A, E>(
  self: Source<A, E>,
  pred: (a: A) => boolean
): Source<A, E>;

export function filter_<A, E>(
  self: Source<A, E>,
  pred: (a: A) => boolean
): Source<A, E> {
  return Filter(pred)(self as any) as any;
}

export function filter<A, B extends A>(
  pred: (a: A) => a is B
): <E>(self: Source<A, E>) => Source<B, E>;

export function filter<A>(
  pred: (a: A) => boolean
): <E>(self: Source<A, E>) => Source<A, E>;

export function filter<A>(pred: (a: A) => boolean) {
  return <E>(self: Source<A, E>) => filter_(self, pred);
}
