import { assert } from "chai"
import { describe, test } from "mocha"
import { Signal } from "strict-callbag"
import * as CB from "../../index"

describe("never", () => {
  test("it only emits start", async () => {
    const signals: Signal[] = []
    CB.never(Signal.START, (signal, data) => {
      signals.push(signal)

      if (signal === Signal.START) {
        data(Signal.DATA)
      }
    })

    await new Promise((r) => setTimeout(r, 0))

    assert.deepEqual(signals, [Signal.START])
  })
})
