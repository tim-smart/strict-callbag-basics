import { assert } from "chai"
import { pipe } from "fp-ts/function"
import { describe, test } from "mocha"
import * as CB from "../../index"

describe("chain", () => {
  test("runs the inner sources sequentially", async () => {
    const result = await pipe(
      CB.fromIter([1, 2, 3]),
      CB.chain((i) => CB.delay_(CB.of(i + 10), 5 - i)),
      CB.toArray,
      CB.lastItemFrom,
    )

    assert.deepEqual(result, [11, 12, 13])
  })
})
