import { assert } from "chai"
import { describe, test } from "mocha"
import * as Rx from "rxjs"
import * as CB from "../../index"

describe("fromObservable", () => {
  test("it works with rxjs observables", async () => {
    const results = await CB.pipe(
      CB.fromObservable(Rx.of(1, 2, 3, 4, 5)),
      CB.toArray,
      CB.lastItemFrom,
    )

    assert.deepEqual(results, [1, 2, 3, 4, 5])
  })
})
