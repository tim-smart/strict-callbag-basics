import { assert } from "chai"
import { describe, test } from "mocha"
import * as CB from "../../index.js"

const fakeFetch = (index: number) =>
  CB.fromPromise_(
    async () => `Got: ${index}`,
    (err) => `Error: ${err}`,
  )

describe("resource", () => {
  test("correctly recurses", async () => {
    const source = CB.resource(0, (acc, _index) =>
      CB.pipe(
        fakeFetch(acc),
        CB.map((data) => [acc < 3 ? acc + 1 : CB.NONE, CB.of(data)]),
      ),
    )

    const results = await CB.pipe(source, CB.toArray, CB.lastItemFrom)

    assert.deepEqual(results, ["Got: 0", "Got: 1", "Got: 2", "Got: 3"])
  })
})
