import { assert } from "chai"
import { pipe } from "../../index.js"
import { describe, test } from "mocha"
import * as CB from "../../index.js"

describe("catchError", () => {
  test("it replaces errors with a new source", async () => {
    const errors: string[] = []
    const result = await pipe(
      CB.asyncP<number, string>((sink) => {
        sink(1, 1)
        sink(1, 2)
        sink(2, "fail")
      }),
      CB.catchError((e) => {
        errors.push(e)
        return CB.of(10)
      }),
      CB.toArray,
      CB.lastItemFrom,
    )

    assert.deepEqual(errors, ["fail"])
    assert.deepEqual(result, [1, 2, 10])
  })
})
