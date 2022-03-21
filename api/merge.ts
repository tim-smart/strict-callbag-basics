import Merge from "callbag-merge";
import { Source } from "strict-callbag";

export const mergeIdentical = <A, E>(...sources: Source<A, E>[]) =>
  Merge(...(sources as any)) as Source<A, E>;

export const merge_ = <A, B, E, E1>(
  self: Source<A, E>,
  other: Source<B, E1>
): Source<A | B, E | E1> => (Merge as any)(self, other);

export const merge =
  <B, E1>(other: Source<B, E1>) =>
  <A, E>(self: Source<A, E>) =>
    merge_(self, other);
