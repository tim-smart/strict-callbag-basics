import { fromIter } from "./fromIter"

export const of = <A>(...as: A[]) => fromIter(as)
