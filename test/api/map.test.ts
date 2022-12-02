import { assert } from "chai"
import { pipe } from "../../index.js"
import { describe, test } from "mocha"
import * as CB from "../../index.js"

describe("map", () => {
  test("transforms data", async () => {
    const result = await pipe(
      CB.fromIter([1, 2, 3, 4, 5]),
      CB.map((e) => `number: ${e}`),
      CB.toArray,
      CB.lastItemFrom,
    )
    assert.deepEqual(result, [
      "number: 1",
      "number: 2",
      "number: 3",
      "number: 4",
      "number: 5",
    ])
  })

  test("has access to index", async () => {
    const result = await pipe(
      CB.fromIter([1, 2, 3, 4, 5]),
      CB.map((e, i) => `index: ${i}`),
      CB.toArray,
      CB.lastItemFrom,
    )
    assert.deepEqual(result, [
      "index: 0",
      "index: 1",
      "index: 2",
      "index: 3",
      "index: 4",
    ])
  })
})
