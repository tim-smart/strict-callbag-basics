import { assert } from "chai"
import { pipe } from "fp-ts/function"
import { describe, test } from "mocha"
import * as CB from "../../index"

describe("toArray", () => {
  test("it emits a single array of every item", async () => {
    const result = await pipe(
      CB.fromIter([1, 2, 3, 4, 5]),
      CB.toArray,
      CB.lastItemFrom,
    )

    assert.deepEqual(result, [1, 2, 3, 4, 5])
  })
})
