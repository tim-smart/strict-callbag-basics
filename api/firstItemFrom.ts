import { Source } from "strict-callbag"
import { subscribe } from "./subscribe.js"

export const firstItemFrom = <A>(self: Source<A, any>): Promise<A> =>
  new Promise((resolve, reject) => {
    const sub = subscribe(self, {
      onStart() {
        sub.pull()
      },
      onData(data) {
        resolve(data)
        sub.cancel()
      },
      onEnd(err) {
        if (err) {
          reject(err)
        } else {
          reject(new Error("source was empty"))
        }
      },
    })

    sub.listen()
  })
