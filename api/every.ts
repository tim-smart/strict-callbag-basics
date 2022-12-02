import { Source } from "strict-callbag"

import { subscribe } from "./subscribe.js"

/**
 * Emits a `boolean`, indicating whether all elements pass the predicate test.
 *
 * @see
 *  - {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every Array.every}
 *  - {@link some}
 */
export const every =
  <A>(pred: (value: A, index: number) => boolean) =>
  (self: Source<A, any>): Promise<boolean> =>
    new Promise((resolve, reject) => {
      let index = 0

      const sub = subscribe(self, {
        onStart() {
          sub.pull()
        },
        onData(data) {
          if (pred(data, index++)) {
            sub.pull()
          } else {
            sub.cancel()
            resolve(false)
          }
        },
        onEnd(err) {
          if (err) {
            reject(err)
          } else {
            resolve(true)
          }
        },
      })

      sub.listen()
    })
