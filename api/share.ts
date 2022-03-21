import Share from "callbag-share";
import { Source } from "strict-callbag";

export const share = <A, E>(self: Source<A, E>): Source<A, E> =>
  (Share as any)(self);
