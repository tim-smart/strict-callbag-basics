import { assert } from "chai"
import { pipe } from "fp-ts/function"
import { describe, test } from "mocha"
import * as CB from "../../index"

describe("fromPromise", () => {
  test("it emits the resolved promise result", async () => {
    const result = await pipe(
      CB.fromPromise_(
        () => Promise.resolve(1),
        (e) => e,
      ),
      CB.toArray,
      CB.lastItemFrom,
    )

    assert.deepEqual(result, [1])
  })

  test("it emits errors", async () => {
    try {
      await pipe(
        CB.fromPromise_(
          () => Promise.reject("fail"),
          (e) => e,
        ),
        CB.toArray,
        CB.lastItemFrom,
      )
    } catch (err) {
      assert.equal(err, "fail")
    }
  })
})
