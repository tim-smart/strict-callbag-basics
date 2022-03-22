import { assert } from "chai"
import { pipe } from "fp-ts/function"
import { describe, test } from "mocha"
import * as CB from "../../index"

describe("async", () => {
  test("it emits data", async () => {
    const result = await pipe(
      CB.async<number>((emit) => {
        emit.data(1)
        emit.data(2)
        emit.data(3)
        emit.end()
      }),
      CB.toArray,
      CB.lastItemFrom,
    )

    assert.deepEqual(result, [1, 2, 3])
  })

  test("it emits errors", async () => {
    try {
      await pipe(
        CB.async<number, "fail">((emit) => {
          emit.data(1)
          emit.error("fail")
        }),
        CB.lastItemFrom,
      )
    } catch (err) {
      assert.equal(err, "fail")
    }
  })

  test("it supports async gaps", async () => {
    const result = await pipe(
      CB.async<number>((emit) => {
        emit.data(1)
        emit.data(2)
        setTimeout(() => {
          emit.data(3)
          emit.end()
        }, 0)
      }),
      CB.toArray,
      CB.lastItemFrom,
    )

    assert.deepEqual(result, [1, 2, 3])
  })
})
