import FromIter from "callbag-from-iter";
import { Source } from "strict-callbag";

export const fromIter = <A>(
  iter: Iterable<A> | Iterator<A>
): Source<A, never> => FromIter(iter) as any;
