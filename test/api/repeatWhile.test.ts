import { assert } from "chai"
import { pipe } from "../../index.js"
import { describe, test } from "mocha"
import * as CB from "../../index.js"

describe("repeatWhile", () => {
  test("it reruns the source if the predicate returns true", async () => {
    let item = 0
    const indexes: number[] = []
    const result = await pipe(
      CB.fromThunk(() => item++),
      CB.repeatWhile((index, item) => {
        indexes.push(index)
        return item !== CB.NONE ? item < 3 : false
      }),
      CB.toArray,
      CB.lastItemFrom,
    )

    assert.deepEqual(indexes, [0, 1, 2, 3])
    assert.deepEqual(result, [0, 1, 2, 3])
  })
})
