import { Source } from "strict-callbag"
import { subscribe } from "./subscribe"

const NONE = Symbol()
type NONE = typeof NONE

export const lastItemFrom = <A>(self: Source<A, any>): Promise<A> =>
  new Promise((resolve, reject) => {
    let lastItem: A | NONE = NONE

    const sub = subscribe(self, {
      onStart() {
        sub.pull()
      },
      onData(data) {
        lastItem = data
        sub.pull()
      },
      onEnd(err) {
        if (err) {
          reject(err)
        } else if (lastItem === NONE) {
          reject(new Error("source was empty"))
        } else {
          resolve(lastItem)
        }
      },
    })

    sub.listen()
  })
