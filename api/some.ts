import { Source } from "strict-callbag"

import { toAsyncIterable } from "./toAsyncIterable"

/**
 * Emits a `boolean`, indicating whether at least one element passes the predicate test.
 *
 * @see
 *  - {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some Array.some}
 *  - {@link every}
 */
export const some =
  <A>(pred: (a: A, index: number) => Promise<boolean> | boolean) =>
  // TODO: make more callbagie.
  async (self: Source<A, never>): Promise<boolean> => {
    let index = 0
    for await (const element of toAsyncIterable(self)) {
      const result = await pred(element, index++)
      if (result) {
        return true
      }
    }
    return false
  }
