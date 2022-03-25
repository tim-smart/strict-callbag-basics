import { assert } from "chai"
import { pipe } from "../../index"
import { describe, test } from "mocha"
import * as CB from "../../index"

describe("zip", () => {
  test("it emits the latest items from each source", async () => {
    const a = pipe(CB.fromIter([1, 2, 3, 4, 5]), CB.delay(9))
    const b = pipe(CB.fromIter(["a", "b", "c"]), CB.delay(5))

    const result = await pipe(CB.zip_(a, b), CB.toArray, CB.lastItemFrom)

    assert.deepEqual(result, [
      [1, "a"],
      [2, "b"],
      [3, "c"],
    ])
  })
})
