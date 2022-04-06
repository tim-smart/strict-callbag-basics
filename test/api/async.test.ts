import { assert, use } from "chai"
import ChaiPromise from "chai-as-promised"
import { pipe } from "../../index"
import { describe, test } from "mocha"
import * as CB from "../../index"

use(ChaiPromise)

describe("async", () => {
  test("it emits data", async () => {
    const result = await pipe(
      CB.asyncP<number>((sink) => {
        sink(1, 1)
        sink(1, 2)
        sink(1, 3)
        sink(2, undefined)
      }),
      CB.toArray,
      CB.lastItemFrom,
    )

    assert.deepEqual(result, [1, 2, 3])
  })

  test("it calls cleanup", async () => {
    let clean = false

    const result = await pipe(
      CB.asyncP<number>((sink) => {
        sink(1, 1)
        sink(1, 2)
        sink(1, 3)
        sink(2, undefined)

        return () => (clean = true)
      }),
      CB.toArray,
      CB.lastItemFrom,
    )

    assert.deepEqual(result, [1, 2, 3])
    assert.isTrue(clean)
  })

  test("it emits errors", async () => {
    try {
      await pipe(
        CB.asyncP<number, "fail">((sink) => {
          sink(1, 1)
          sink(2, "fail")
        }),
        CB.lastItemFrom,
      )
    } catch (err) {
      assert.equal(err, "fail")
    }
  })

  test("it supports async gaps", async () => {
    const result = await pipe(
      CB.asyncP<number>((sink) => {
        sink(1, 1)
        sink(1, 2)
        setTimeout(() => {
          sink(1, 3)
          sink(2, undefined)
        }, 0)
      }),
      CB.toArray,
      CB.lastItemFrom,
    )

    assert.deepEqual(result, [1, 2, 3])
  })
})

describe("asyncEmitter", () => {
  test("it emits the items", async () => {
    const [sink, source] = CB.asyncSinkP<number, string>()

    const [results] = await Promise.all([
      pipe(CB.toArray(source), CB.lastItemFrom),
      new Promise<void>((r) =>
        setTimeout(() => {
          sink(1, 1)
          sink(1, 2)
          sink(1, 3)
          sink(2, undefined)
          r()
        }, 0),
      ),
    ])

    assert.deepEqual(results, [1, 2, 3])
  })

  test("it buffers when there is no listener", async () => {
    const [sink, source] = CB.asyncSinkP<number, string>()

    sink(1, 1)
    assert.equal(await CB.firstItemFrom(source), 1)

    sink(1, 2)
    assert.equal(await CB.firstItemFrom(source), 2)

    sink(2, undefined)
    await assert.isRejected(CB.firstItemFrom(source))
  })
})
