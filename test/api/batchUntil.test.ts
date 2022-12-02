import { assert } from "chai"
import { pipe } from "../../index.js"
import { describe, test } from "mocha"
import * as CB from "../../index.js"

describe("batchUntil", () => {
  test("it batches items", async () => {
    const result = await pipe(
      CB.fromIter([1, 2, 3, 4, 5]),
      CB.batchUntil((i) => i % 2 === 0),
      CB.toArray,
      CB.lastItemFrom,
    )

    assert.deepEqual(result, [[1], [2, 3], [4, 5]])
  })

  test("it works if first item matches", async () => {
    const result = await pipe(
      CB.fromIter([2, 3, 4, 5]),
      CB.batchUntil((i) => i % 2 === 0),
      CB.toArray,
      CB.lastItemFrom,
    )

    assert.deepEqual(result, [
      [2, 3],
      [4, 5],
    ])
  })

  test("inclusive mode", async () => {
    const result = await pipe(
      CB.fromIter([2, 3, 4, 5]),
      CB.batchUntil((i) => i % 2 === 0, true),
      CB.toArray,
      CB.lastItemFrom,
    )

    assert.deepEqual(result, [[2], [3, 4], [5]])
  })
})
