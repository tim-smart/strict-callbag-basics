import cbTakeWhile from "callbag-take-while"
import { Source } from "strict-callbag"

export function takeWhile_<A, E, B extends A>(
  self: Source<A, E>,
  pred: (a: A) => a is B,
): Source<B, E>

export function takeWhile_<A, E>(
  self: Source<A, E>,
  pred: (a: A) => boolean,
): Source<A, E>

export function takeWhile_<A, E>(
  self: Source<A, E>,
  pred: (a: A) => boolean,
): Source<A, E> {
  return (cbTakeWhile as any)(pred)(self)
}

export function takeWhile<A, B extends A>(
  pred: (a: A) => a is B,
): <E>(self: Source<A, E>) => Source<B, E>

export function takeWhile<A>(
  pred: (a: A) => boolean,
): <E>(self: Source<A, E>) => Source<A, E>

export function takeWhile<A>(pred: (a: A) => boolean) {
  return <E>(self: Source<A, E>) => takeWhile_(self, pred)
}
