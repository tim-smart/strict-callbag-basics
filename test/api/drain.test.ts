import { assert } from "chai"
import { pipe } from "fp-ts/function"
import { describe, test } from "mocha"
import * as CB from "../../index"

describe("drain", () => {
  test("ignores all data elements", async () => {
    const result = await pipe(
      CB.of(1, 2, 3, 4, 5),
      CB.drain,
      CB.toArray,
      CB.lastItemFrom,
    )

    assert.deepEqual(result, [])
  })
})
