import { Signal, Source } from "strict-callbag"
import { createPipe } from "./createPipe"
import { subscribe, Subscription } from "./subscribe"

const makeLB = <E, A>(
  onData: (a: A) => void,
  onError: (e: E) => void,
  onEnd: () => void,
  onChildEnd: () => void,
) => {
  let parentEnded = false

  const subscriptions: Subscription[] = []
  let pullIndex = 0

  const add = (source: Source<A, E>) => {
    const sub = subscribe(source, {
      onStart() {},
      onData,
      onEnd(err) {
        if (err) {
          error(err, sub)
        } else {
          endSubscription(sub)
        }
      },
    })

    sub.listen()
    subscriptions.push(sub)

    if (subscriptions.length === 1) {
      sub.pull()
    }
  }

  const endSubscription = (sub: Subscription) => {
    const index = subscriptions.indexOf(sub)
    subscriptions.splice(index, 1)

    if (index < pullIndex) {
      pullIndex--
    }

    if (!subscriptions.length && parentEnded) {
      onEnd()
    } else {
      onChildEnd()
    }
  }

  const end = () => {
    parentEnded = true

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
    onError(err)
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
    error,
    size: () => subscriptions.length,
  } as const
}

export const chainPar_ =
  <E, E1, A, B>(
    self: Source<A, E>,
    fab: (a: A) => Source<B, E1>,
    maxInnerCount = Infinity,
  ): Source<B, E | E1> =>
  (_, sink) => {
    const lb = makeLB<E | E1, B>(
      (a) => sink(Signal.DATA, a),
      (e) => sink(Signal.END, e),
      () => sink(Signal.END, undefined),
      () => maybePullInner(),
    )

    let sub: Subscription

    function maybePullInner() {
      if (sub && lb.size() < maxInnerCount) {
        sub.pull()
      }
    }

    createPipe(self, sink, {
      onStart(s) {
        sub = s
        lb.pull()
        maybePullInner()
      },

      onData(_, data) {
        const inner = fab(data)
        lb.add(inner)
        maybePullInner()
      },

      onEnd(err) {
        if (err) {
          lb.error(err)
        } else {
          lb.end()
        }
      },

      onRequest() {
        lb.pull()
      },

      onAbort() {
        lb.abort()
      },
    })
  }
