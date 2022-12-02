import { assert } from "chai"
import { describe, test } from "mocha"
import { Signal } from "strict-callbag"
import * as CB from "../../index.js"

describe("error", () => {
  test("it only emits start and end with error", async () => {
    const signals: Signal[] = []
    let err: any

    CB.error("fail")(0, (signal, data) => {
      signals.push(signal)

      if (signal === 0) {
        data(1)
      } else if (signal === 2) {
        err = data
      }
    })

    await new Promise((r) => setTimeout(r, 0))

    assert.deepEqual(signals, [0, 2])
    assert.equal(err, "fail")
  })
})
