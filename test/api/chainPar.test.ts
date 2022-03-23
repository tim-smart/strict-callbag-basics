import { assert } from "chai"
import { pipe } from "fp-ts/function"
import { describe, test } from "mocha"
import * as CB from "../../index"

describe("chainPar", () => {
  test("runs the inner sources in parallel", async () => {
    const result = await pipe(
      CB.fromIter([1, 2, 3]),
      CB.chainPar((i) => CB.delay_(CB.of(i + 10), 20 - i * 5)),
      CB.toArray,
      CB.lastItemFrom,
    )

    assert.deepEqual(result, [13, 12, 11])
  })
})
