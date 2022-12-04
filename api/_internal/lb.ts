import { Source } from "strict-callbag"
import { subscribe, Subscription } from "../subscribe.js"

export const make = <E, A>(
  onData: (a: A) => void,
  onEnd: (e?: E, source?: Subscription) => void,
  onChildEnd: () => void,
  onFailedPull?: () => void,
) => {
  let parentEnded = false
  let parentError: E | undefined

  const subscriptions = new Set<Subscription>()
  const pullQueue = new Set<Subscription>()

  const add = (source: Source<A, E>) => {
    const sub = subscribe(source, {
      onStart() {
        sub.pull()
      },
      onData(data) {
        pullQueue.add(sub)
        onData(data)
      },
      onEnd(err) {
        if (err !== undefined) {
          error(err, sub)
        } else {
          endSubscription(sub)
        }
      },
    })

    subscriptions.add(sub)
    sub.listen()
  }

  const endSubscription = (sub: Subscription) => {
    subscriptions.delete(sub)
    pullQueue.delete(sub)

    if (subscriptions.size === 0 && parentEnded) {
      onEnd(parentError)
    } else {
      onChildEnd()

      if (sub.waiting()) {
        pull()
      }
    }
  }

  const end = (err?: E) => {
    parentEnded = true
    parentError = err

    if (!subscriptions.size) {
      onEnd()
    }
  }

  const abort = (from?: Subscription) => {
    // eslint-disable-next-line
    subscriptions.forEach((sub) => from !== sub && sub.cancel())
    subscriptions.clear()
    pullQueue.clear()
  }

  const error = (err: E, sub?: Subscription) => {
    abort(sub)
    onEnd(err, sub)
  }

  const pull = () => {
    if (pullQueue.size === 0) {
      onFailedPull?.()
      return
    }

    const [head] = pullQueue
    pullQueue.delete(head)
    head.pull()
  }

  return {
    pull,
    add,
    end,
    abort,
    size: () => subscriptions.size,
  } as const
}
