import { Source } from "strict-callbag"
import { firstItemFrom } from "./firstItemFrom"
import { toArray } from "./toArray"

export const toArrayPromise = <A>(self: Source<A, any>): Promise<A[]> =>
  firstItemFrom(toArray(self))
