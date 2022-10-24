import { Source } from "strict-callbag"

import { lastItemFrom } from "./lastItemFrom"
import { pipe } from "./pipe"
import { toArray } from "./toArray"

/**
 * Run the given aggregator on the source.
 */
export const aggregate =
  <A, R, E = any>(aggregator: (source: Source<A, E>) => R) =>
  (self: Source<A, E>): R =>
    aggregator(self)

/**
 * Accumulates all values into an array that is then passes it into the
 * aggregator (callback), to process the data and return the result.
 *
 * Requires the source to be finite.
 */
export const aggregateArray =
  <A, R, E = any>(aggregator: (data: A[]) => R) =>
  (self: Source<A, E>): Promise<R> =>
    pipe(self, toArray, lastItemFrom).then((data) => aggregator(data))
