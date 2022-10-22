import { Source } from "strict-callbag"

import { subscribe } from "./subscribe"

/**
 * Emits a `boolean`, indicating whether at least one element passes the predicate test.
 *
 * @see
 *  - {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some Array.some}
 *  - {@link every}
 */
export const some =
  <A>(pred: (value: A, index: number) => boolean) =>
  (self: Source<A, any>): Promise<boolean> =>
    new Promise((resolve, reject) => {
      let result = false
      let index = 0

      const sub = subscribe(self, {
        onStart() {
          sub.pull()
        },
        onData(data) {
          result = result || pred(data, index++)
          sub.pull()
        },
        onEnd(err) {
          if (err) {
            reject(err)
          } else {
            resolve(result)
          }
        },
      })

      sub.listen()
    })
