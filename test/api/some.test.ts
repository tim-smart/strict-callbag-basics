import { assert } from "chai"
import { pipe } from "../../index"
import { describe, test } from "mocha"
import * as CB from "../../index"

describe("some", () => {
  test("it tests if some predicate holds (positvie case)", async () => {
    const result = await pipe(
      CB.fromIter([1, 2, 3, 4, 5]),
      CB.some((value) => value > 4),
    )

    assert.deepEqual(result, true)
  })

  test("it tests if some predicate holds (negative case)", async () => {
    const result = await pipe(
      CB.fromIter([1, 2, 3, 4, 5]),
      CB.some((value) => value > 10),
    )

    assert.deepEqual(result, false)
  })

  test("it works with an empty source", async () => {
    const pred = () => true

    const empty: never[] = []
    const expected = empty.some(pred)
    const actual = await pipe(CB.fromIter(empty), CB.some(pred))

    assert.deepEqual(actual, expected)
  })
})
