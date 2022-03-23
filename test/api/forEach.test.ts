import { assert } from "chai"
import { describe, test } from "mocha"
import * as CB from "../../index"
import { pipe } from "../../index"

describe("forEach", () => {
  test("runs the function for every item", async () => {
    const items: number[] = []

    await pipe(
      CB.fromIter([1, 2, 3, 4, 5]),
      CB.forEach((a) => {
        items.push(a)
      }),
    )

    assert.deepEqual(items, [1, 2, 3, 4, 5])
  })
})
