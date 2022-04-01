import { assert } from "chai"
import { pipe } from "../../index"
import { describe, test } from "mocha"
import * as CB from "../../index"
import * as Rx from "rxjs"

describe("toObservable", () => {
  test("it can be consumed by rxjs", async () => {
    const result = await pipe(
      CB.fromIter([1, 2, 3, 4, 5]),
      CB.toObservable,
      Rx.from,
      Rx.toArray(),
      Rx.lastValueFrom,
    )

    assert.deepEqual(result, [1, 2, 3, 4, 5])
  })
})

describe("toObservableWithPull", () => {
  test("it can be consumed by rxjs", async () => {
    const [obs, pull] = CB.toObservableWithPull(CB.of(1, 2, 3, 4, 5))

    const results: number[] = []
    const s = Rx.from(obs).subscribe((i) => results.push(i))

    await new Promise<void>((r) => {
      pull()
      pull()
      s.unsubscribe()
      r()
    })

    assert.deepEqual(results, [1, 2, 3])
  })
})
