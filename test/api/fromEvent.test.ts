import { assert } from "chai"
import EventEmitter from "events"
import { describe, test } from "mocha"
import * as CB from "../../index"

const emitter = new EventEmitter()

describe("fromEvent", () => {
  test("receives events", async () => {
    setTimeout(() => {
      emitter.emit("data", 1)
      emitter.emit("data", 2)
      emitter.emit("data", 3)
    }, 0)

    const results = await CB.pipe(
      CB.fromEvent<number>(emitter, "data"),
      CB.take(3),
      CB.toArray,
      CB.lastItemFrom,
    )

    assert.deepEqual(results, [1, 2, 3])
  })
})
