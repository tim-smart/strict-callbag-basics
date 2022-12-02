import { assert } from "chai"
import { describe, test } from "mocha"
import * as CB from "../../index.js"

describe("overridePull", () => {
  test("it ignores the internal talkback", async () => {
    const numbers = CB.of(1, 2, 3, 4, 5)
    const [source] = CB.overridePull(numbers)
    const results: number[] = []

    source(0, (signal, data) => {
      if (signal === 0) {
        data(1)
        data(1)
        data(1)
      } else if (signal === 1) {
        results.push(data)
      }
    })

    assert.deepEqual(results, [1])
  })

  test("that the pull function works", async () => {
    const numbers = CB.of(1, 2, 3, 4, 5)
    const [source, pull] = CB.overridePull(numbers)
    const results: number[] = []

    source(0, (signal, data) => {
      if (signal === 1) {
        results.push(data)
      }
    })

    pull()
    pull()

    assert.deepEqual(results, [1, 2, 3])
  })
})
