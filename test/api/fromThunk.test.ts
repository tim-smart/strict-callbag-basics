import { assert } from "chai"
import { pipe } from "../../index.js"
import { describe, test } from "mocha"
import * as CB from "../../index.js"
import { Talkback } from "strict-callbag"

describe("fromThunk", () => {
  test("it emits the function result", async () => {
    const result = await pipe(
      CB.fromThunk(() => 1),
      CB.toArray,
      CB.lastItemFrom,
    )

    assert.deepEqual(result, [1])
  })

  test("it only emits if asked", async () => {
    const source = CB.fromThunk(() => 1)
    const results: number[] = []
    let tb: Talkback | undefined

    source(0, (signal, data) => {
      if (signal === 0) {
        tb = data
      } else if (signal === 1) {
        results.push(data)
      }
    })

    assert.deepEqual(results, [])
    tb!(1)
    assert.deepEqual(results, [1])
  })
})
