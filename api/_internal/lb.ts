import { Source } from "strict-callbag"
import { subscribe, Subscription } from "../subscribe"

export const make = <E, A>(
  onData: (a: A) => void,
  onEnd: (e?: E) => void,
  onChildEnd: () => void,
) => {
  let parentEnded = false
  let parentError: E | undefined

  const subscriptions: Subscription[] = []
  let pullIndex = 0

  const add = (source: Source<A, E>) => {
    const sub = subscribe(source, {
      onStart() {
        sub.pull()
      },
      onData,
      onEnd(err) {
        if (err) {
          error(err, sub)
        } else {
          endSubscription(sub)
        }
      },
    })

    subscriptions.push(sub)
    sub.listen()
  }

  const endSubscription = (sub: Subscription) => {
    const index = subscriptions.indexOf(sub)
    subscriptions.splice(index, 1)

    if (index < pullIndex) {
      pullIndex--
    }

    if (!subscriptions.length && parentEnded) {
      onEnd(parentError)
    } else {
      onChildEnd()
    }
  }

  const end = (err?: E) => {
    parentEnded = true
    parentError = err

    if (!subscriptions.length) {
      onEnd()
    }
  }

  const abort = (from?: Subscription) => {
    subscriptions.forEach((sub) => from !== sub && sub.cancel())
    subscriptions.splice(0)
  }

  const error = (err: E, sub?: Subscription) => {
    abort(sub)
    onEnd(err)
  }

  const pull = () => {
    if (!subscriptions.length) {
      return
    }

    if (pullIndex >= subscriptions.length) {
      pullIndex = 0
    }

    const sub = subscriptions[pullIndex]
    sub.pull()
    pullIndex++
  }

  return {
    pull,
    add,
    end,
    abort,
    size: () => subscriptions.length,
  } as const
}
