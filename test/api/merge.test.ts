import { assert } from "chai"
import { pipe } from "../../index"
import { describe, test } from "mocha"
import * as CB from "../../index"

describe("merge", () => {
  test("it emits the given items", async () => {
    const result = await pipe(
      CB.merge_(CB.of(1, 2, 3, 4, 5), CB.of(6, 7, 8, 9, 10)),
      CB.toArray,
      CB.lastItemFrom,
    )

    assert.deepEqual(result, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
  })
})
