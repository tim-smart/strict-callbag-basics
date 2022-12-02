import { assert, use } from "chai"
import { pipe } from "../../index.js"
import { describe, test } from "mocha"
import * as CB from "../../index.js"
import CAP from "chai-as-promised"

use(CAP)

describe("reduce", () => {
  test("it can sum numbers", async () => {
    const result = await pipe(
      CB.fromIter([1, 2, 3, 4, 5]),
      CB.reduce((prev, curr) => prev + curr),
    )

    assert.deepEqual(result, 15)
  })

  test("it can sum number using an initial value", async () => {
    const result = await pipe(
      CB.fromIter([1, 2, 3, 4, 5]),
      CB.reduce((prev, curr) => prev + curr, 5),
    )

    assert.deepEqual(result, 20)
  })

  test("it can produce a result of a different type", async () => {
    const result = await pipe(
      CB.fromIter([1, 2, 3, 4, 5]),
      CB.reduce((prev, curr) => `${prev}${curr}`, ""),
    )

    assert.deepEqual(result, "12345")
  })

  test("it can produce a result of a different type while using an initial value", async () => {
    const result = await pipe(
      CB.fromIter([1, 2, 3, 4, 5]),
      CB.reduce((prev, curr) => `${prev}${curr}`, "0"),
    )

    assert.deepEqual(result, "012345")
  })

  test("it does call the reducer with 0th element when an initial value is given (even with undefined)", async () => {
    const result = await pipe(
      CB.fromIter([1, 2, 3, 4, 5]),
      CB.reduce<number, boolean | number | undefined>(
        (prev, _, index) => index === 0 || prev,
        undefined,
      ),
    )

    assert.deepEqual(result, true)
  })

  test("it throw on empty source with no initial value", () => {
    const result = pipe(
      CB.fromIter([]),
      CB.reduce(() => "" as never),
    )

    assert.isRejected(result)
  })

  test("it works with an empty source when there is an initial value", async () => {
    const result = await pipe(
      CB.fromIter([]),
      CB.reduce(() => "" as never, "foo"),
    )

    assert.deepEqual(result, "foo")
  })
})
