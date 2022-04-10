import { assert } from "chai"
import { describe, test } from "mocha"
import { Signal } from "strict-callbag"
import * as CB from "../../index"

describe("never", () => {
  test("it only emits start", async () => {
    const signals: Signal[] = []
    CB.never(0, (signal, data) => {
      signals.push(signal)

      if (signal === 0) {
        data(1)
      }
    })

    await new Promise((r) => setTimeout(r, 0))

    assert.deepEqual(signals, [0])
  })
})
