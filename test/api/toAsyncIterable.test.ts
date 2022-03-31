import { assert } from "chai"
import { pipe } from "../../index"
import { describe, test } from "mocha"
import * as CB from "../../index"

describe("toAsyncIterable", () => {
  test("it creates a valid async iterable", async () => {
    const iterable = pipe(CB.fromIter([1, 2, 3, 4, 5]), CB.toAsyncIterable)

    const results: number[] = []

    for await (const i of iterable) {
      results.push(i)
    }

    assert.deepEqual(results, [1, 2, 3, 4, 5])
  })
})
