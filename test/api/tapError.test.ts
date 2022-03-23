import { assert } from "chai"
import { pipe } from "../../index"
import { describe, test } from "mocha"
import * as CB from "../../index"

describe("tapError", () => {
  test("transforms errors", async () => {
    let error = false

    try {
      await pipe(
        CB.error("fail"),
        CB.tapError((e) => `ERROR: ${e}`),
        CB.run_,
      )
    } catch (err) {
      error = true
      assert.equal(err, "fail")
    }

    assert.isTrue(error)
  })
})
