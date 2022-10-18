import { assert } from "chai"
import { pipe } from "../../index"
import { describe, test } from "mocha"
import * as CB from "../../index"

describe("aggregate", () => {
  test("it emits a single value from the callback", async () => {
    const result = await pipe(
      CB.fromIter([3, 1, 2, 5, 4]),
      CB.aggregate((values) => pipe(values, CB.lastItemFrom)),
    )

    assert.deepEqual(result, 4)
  })
})

describe("aggregateArray", () => {
  test("it emits a single value from the callback", async () => {
    const result = await pipe(
      CB.fromIter([3, 1, 2, 5, 4]),
      CB.aggregateArray((values) => values.sort().join()),
    )

    assert.deepEqual(result, "1,2,3,4,5")
  })
})
