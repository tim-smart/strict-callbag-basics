import { Source } from "strict-callbag"
import { subscribe, Subscription } from "../subscribe"

export const make = <E, A>(
  onData: (a: A) => void,
  onEnd: (e?: E) => void,
  onChildEnd: () => void,
) => {
  let parentEnded = false
  let parentError: E | undefined

  const waiting = new Set<Subscription>()
  const idle = new Set<Subscription>()

  const size = () => waiting.size + idle.size

  const add = (source: Source<A, E>) => {
    const sub = subscribe(source, {
      onStart() {
        sub.pull()
      },
      onData(data) {
        waiting.delete(sub)
        idle.add(sub)
        onData(data)
      },
      onEnd(err) {
        if (err) {
          error(err, sub)
        } else {
          endSubscription(sub)
        }
      },
    })

    waiting.add(sub)
    sub.listen()
  }

  const endSubscription = (sub: Subscription) => {
    waiting.delete(sub)
    idle.delete(sub)

    if (!size() && parentEnded) {
      onEnd(parentError)
    } else {
      onChildEnd()
    }
  }

  const end = (err?: E) => {
    parentEnded = true
    parentError = err

    if (!size()) {
      onEnd()
    }
  }

  const abort = (from?: Subscription) => {
    // eslint-disable-next-line
    ;[...waiting, ...idle].forEach((sub) => from !== sub && sub.cancel())
    waiting.clear()
    idle.clear()
  }

  const error = (err: E, sub?: Subscription) => {
    abort(sub)
    onEnd(err)
  }

  const pull = () => {
    if (!size()) {
      return
    }

    if (idle.size) {
      const sub = idle[Symbol.iterator]().next().value as Subscription
      idle.delete(sub)
      waiting.add(sub)
      sub.pull()
    }
  }

  return {
    pull,
    add,
    end,
    abort,
    size,
    waiting: () => waiting.size,
    idle: () => idle.size,
  } as const
}
