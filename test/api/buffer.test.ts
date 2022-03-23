import { assert } from "chai"
import { pipe } from "../../index"
import { describe, test } from "mocha"
import * as CB from "../../index"

describe("buffer", () => {
  test("it does not modify the source", async () => {
    const result = await pipe(
      CB.fromIter([1, 2, 3, 4, 5]),
      CB.buffer(),
      CB.lastItemFrom,
    )

    assert.deepEqual(result, 5)
  })

  test("bufferSize drops extra items", async () => {
    const source = CB.share(CB.fromIter([1, 2, 3, 4, 5]))
    const [result] = await Promise.all([
      pipe(source, CB.buffer(2), CB.delay(5), CB.lastItemFrom),
      CB.run_(source),
    ])

    // one passes immediate to delay, two hit the buffer, two get dropped
    assert.equal(result, 3)
  })
})
