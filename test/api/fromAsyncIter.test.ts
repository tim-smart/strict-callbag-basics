import { assert } from "chai"
import { describe, test } from "mocha"
import * as CB from "../../index.js"

describe("fromAsyncIter", () => {
  test("it correctly consumes numbers", async () => {
    const results = await CB.pipe(
      CB.fromAsyncIter<number>(
        (async function* () {
          for (let index = 0; index < 5; index++) {
            yield Promise.resolve(index)
          }
        })(),
      ),
      CB.toArray,
      CB.lastItemFrom,
    )

    assert.deepEqual(results, [0, 1, 2, 3, 4])
  })
})
