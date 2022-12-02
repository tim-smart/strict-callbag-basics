import { Source } from "strict-callbag"
import { subscribe, Subscription } from "./subscribe.js"

export const overridePull = <A, E>(
  self: Source<A, E>,
  initialPulls = 1,
): readonly [source: Source<A, E>, pull: () => void] => {
  const subscriptions = new Set<Subscription>()

  const source: Source<A, E> = (_, sink) => {
    let waitingPulls = initialPulls

    const sub = subscribe(self, {
      onStart() {
        subscriptions.add(sub)

        if (waitingPulls > 0) {
          waitingPulls--
          sub.pull()
        }
      },
      onData(data) {
        sink(1, data)

        if (waitingPulls > 0) {
          waitingPulls--
          sub.pull()
        }
      },
      onEnd(err) {
        subscriptions.delete(sub)
        sink(2, err)
      },
    })

    sink(0, (signal) => {
      if (signal === 2) {
        subscriptions.delete(sub)
        sub.cancel()
      }
    })

    sub.listen()
  }

  const pull = () => subscriptions.forEach((s) => s.pull())

  return [source, pull]
}
