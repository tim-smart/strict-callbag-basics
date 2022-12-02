import { Source } from "strict-callbag"
import symbol from "symbol-observable"
import { subscribe, Subscription } from "./subscribe.js"
import { InteropObservable, Subscribable } from "./_internal/observable.js"

export const toObservable = <A>(self: Source<A, any>): InteropObservable<A> => {
  const sub: Subscribable<A> = {
    subscribe(observer) {
      const s = subscribe(self, {
        onStart() {
          s.pull()
        },
        onData(data) {
          observer?.next?.(data)
          s.pull()
        },
        onEnd(err) {
          if (err) {
            observer?.error?.(err)
          } else {
            observer?.complete?.()
          }
        },
      })

      s.listen()

      return {
        unsubscribe() {
          s.cancel()
        },
      }
    },
  }

  return {
    [symbol as any as typeof Symbol.observable]() {
      return sub
    },
  }
}

export const toObservableWithPull = <A>(
  self: Source<A, any>,
  initialPulls = 1,
): readonly [observable: InteropObservable<A>, pull: () => void] => {
  const subscriptions = new Set<Subscription>()

  const sub: Subscribable<A> = {
    subscribe(observer) {
      let remainingPulls = initialPulls
      const maybePull = () => {
        if (remainingPulls <= 0) return

        remainingPulls--
        s.pull()
      }

      const s = subscribe(self, {
        onStart() {
          maybePull()
        },
        onData(data) {
          observer?.next?.(data)
          maybePull()
        },
        onEnd(err) {
          subscriptions.delete(s)

          if (err) {
            observer?.error?.(err)
          } else {
            observer?.complete?.()
          }
        },
      })

      subscriptions.add(s)
      s.listen()

      return {
        unsubscribe() {
          subscriptions.delete(s)
          s.cancel()
        },
      }
    },
  }

  return [
    {
      [symbol as any as typeof Symbol.observable]() {
        return sub
      },
    },
    () => subscriptions.forEach((s) => s.pull()),
  ]
}
