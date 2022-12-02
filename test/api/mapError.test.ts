import { assert } from "chai"
import { pipe } from "../../index.js"
import { describe, test } from "mocha"
import * as CB from "../../index.js"

describe("mapError", () => {
  test("transforms errors", async () => {
    let error = false

    try {
      await pipe(
        CB.error("fail"),
        CB.mapError((e) => `ERROR: ${e}`),
        CB.run_,
      )
    } catch (err) {
      error = true
      assert.equal(err, "ERROR: fail")
    }

    assert.isTrue(error)
  })
})
