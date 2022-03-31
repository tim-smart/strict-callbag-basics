import { assert } from "chai"
import { pipe } from "../../index"
import { describe, test } from "mocha"
import * as CB from "../../index"

describe("repeatWhile", () => {
  test("it reruns the source if the predicate returns true", async () => {
    let item = 0
    const result = await pipe(
      CB.fromThunk(() => item++),
      CB.repeatWhile((_index, item) => (item !== CB.NONE ? item < 3 : false)),
      CB.toArray,
      CB.lastItemFrom,
    )

    assert.deepEqual(result, [0, 1, 2, 3])
  })
})
