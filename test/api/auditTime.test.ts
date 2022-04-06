import { assert } from "chai"
import { pipe } from "../../index"
import { describe, test } from "mocha"
import * as CB from "../../index"

describe("auditTime", () => {
  test("it does not modify the source", async () => {
    const result = await pipe(
      CB.fromIter([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
      CB.chain((a) => CB.delay_(CB.of(a), 10)),
      CB.auditTimeP(20),
      CB.toArray,
      CB.lastItemFrom,
    )

    assert.deepEqual(result, [2, 4, 6, 8, 10])
  })
})
