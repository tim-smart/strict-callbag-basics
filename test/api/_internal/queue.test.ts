import { assert } from "chai"
import { describe, test } from "mocha"
import { NONE } from "../../../api/none.js"
import { Queue } from "../../../api/_internal/queue.js"

describe("Queue", () => {
  test("it works", async () => {
    const q = new Queue()
    q.push(1)
    q.push(2)
    q.push(3)

    assert.equal(q.size, 3)
    assert.equal(q.shift(), 1)
    assert.equal(q.size, 2)

    assert.equal(q.shift(), 2)
    assert.equal(q.shift(), 3)
    assert.equal(q.shift(), NONE)
    assert.equal(q.shift(), NONE)
    assert.equal(q.size, 0)
  })

  test("capacity", async () => {
    const q = new Queue(2)
    q.push(1)
    q.push(2)
    q.push(3)

    assert.equal(q.size, 2)
    assert.equal(q.shift(), 1)
  })
})
