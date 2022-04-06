import { assert } from "chai"
import { pipe } from "../../index"
import { describe, test } from "mocha"
import * as CB from "../../index"
import * as FS from "fs"

describe("fromCallback", () => {
  test("it emits the resolved callback result", async () => {
    const result = await pipe(
      CB.fromCallback<Buffer>((cb) => FS.readFile(__filename, cb)),
      CB.lastItemFrom,
    )

    assert.isTrue(result.toString().startsWith("import"))
  })

  test("it emits errors", async () => {
    try {
      await pipe(
        CB.fromCallback((cb) => cb("fail")),
        CB.lastItemFrom,
      )
    } catch (err) {
      assert.equal(err, "fail")
    }
  })
})
