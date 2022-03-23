import { assert } from "chai"
import { pipe } from "../../index"
import { describe, test } from "mocha"
import * as CB from "../../index"

describe("tap", () => {
  test("runs the side effect for every item", async () => {
    const items: number[] = []

    const result = await pipe(
      CB.fromIter([1, 2, 3, 4, 5]),
      CB.tap((a) => {
        items.push(a)
        return "ignored"
      }),
      CB.toArray,
      CB.lastItemFrom,
    )

    assert.deepEqual(result, [1, 2, 3, 4, 5])
    assert.deepEqual(items, [1, 2, 3, 4, 5])
  })
})
