import { assert, use } from "chai"
import ChaiPromise from "chai-as-promised"
import { pipe } from "../../index"
import { describe, test } from "mocha"
import * as CB from "../../index"

use(ChaiPromise)

describe("async", () => {
  test("it emits data", async () => {
    const result = await pipe(
      CB.async<number>((emit) => {
        emit.data(1)
        emit.data(2)
        emit.data(3)
        emit.end()
      }),
      CB.toArray,
      CB.lastItemFrom,
    )

    assert.deepEqual(result, [1, 2, 3])
  })

  test("it calls cleanup", async () => {
    let clean = false

    const result = await pipe(
      CB.async<number>((emit) => {
        emit.data(1)
        emit.data(2)
        emit.data(3)
        emit.end()

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
        CB.async<number, "fail">((emit) => {
          emit.data(1)
          emit.error("fail")
        }),
        CB.lastItemFrom,
      )
    } catch (err) {
      assert.equal(err, "fail")
    }
  })

  test("it supports async gaps", async () => {
    const result = await pipe(
      CB.async<number>((emit) => {
        emit.data(1)
        emit.data(2)
        setTimeout(() => {
          emit.data(3)
          emit.end()
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
    const [emit, source] = CB.asyncEmitter<number, string>()

    const [results] = await Promise.all([
      pipe(CB.toArray(source), CB.lastItemFrom),
      new Promise<void>((r) =>
        setTimeout(() => {
          emit.data(1)
          emit.data(2)
          emit.data(3)
          emit.end()
          r()
        }, 0),
      ),
    ])

    assert.deepEqual(results, [1, 2, 3])
  })

  test("it buffers when there is no listener", async () => {
    const [emit, source] = CB.asyncEmitter<number, string>()

    emit.data(1)
    assert.equal(await CB.firstItemFrom(source), 1)

    emit.data(2)
    assert.equal(await CB.firstItemFrom(source), 2)

    emit.end()
    await assert.isRejected(CB.firstItemFrom(source))
  })
})
