import { Source } from "strict-callbag"
import { firstItemFrom } from "./firstItemFrom.js"
import { toArray } from "./toArray.js"

export const toArrayPromise = <A>(self: Source<A, any>): Promise<A[]> =>
  firstItemFrom(toArray(self))
