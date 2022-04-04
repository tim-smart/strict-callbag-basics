import { assert } from "chai"
import { describe, test } from "mocha"
import * as CB from "../../index"
import * as CBS from "../../Sink"

describe("map", () => {
  test("transforms data", async () => {
    const [sink, source] = CB.asyncSink<string, never>()

    const numberSink = CBS.map_(sink, (i: number) => `Got: ${i}`)
    CB.run_(CB.of(1, 2, 3), numberSink)

    const results = await CB.pipe(source, CB.toArray, CB.lastItemFrom)

    assert.deepEqual(results, ["Got: 1", "Got: 2", "Got: 3"])
  })
})
