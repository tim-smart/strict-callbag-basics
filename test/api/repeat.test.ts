import { assert } from "chai"
import { pipe } from "../../index"
import { describe, test } from "mocha"
import * as CB from "../../index"

describe("repeat", () => {
  test("it reruns the source 3 times", async () => {
    const result = await pipe(
      CB.of(1),
      CB.repeat(2),
      CB.toArray,
      CB.lastItemFrom,
    )

    // Intial run + two repeats
    assert.deepEqual(result, [1, 1, 1])
  })
})
