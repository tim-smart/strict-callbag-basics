import { assert } from "chai"
import { pipe } from "fp-ts/function"
import { describe, test } from "mocha"
import * as CB from "../../index"

describe("catchError", () => {
  test("it replaces errors with a new source", async () => {
    const errors: string[] = []
    const result = await pipe(
      CB.async<number, string>((emit) => {
        emit.data(1)
        emit.data(2)
        emit.error("fail")
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
