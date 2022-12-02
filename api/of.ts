import { fromIter } from "./fromIter.js"

export const of = <A>(...as: A[]) => fromIter(as)
