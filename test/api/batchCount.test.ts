import { assert } from "chai"
import { pipe } from "../../index"
import { describe, test } from "mocha"
import * as CB from "../../index"

describe("batchCount", () => {
  test("it batches items", async () => {
    const result = await pipe(
      CB.fromIter([1, 2, 3, 4, 5]),
      CB.batchCount(2),
      CB.toArray,
      CB.lastItemFrom,
    )

    assert.deepEqual(result, [[1, 2], [3, 4], [5]])
  })
})
