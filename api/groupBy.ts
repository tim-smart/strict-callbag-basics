import { Signal, Source } from "strict-callbag"
import { createPipe } from "./createPipe"
import { filter_ } from "./filter"
import { share } from "./share"
import { startWith_ } from "./startWith"

export const groupBy_ =
  <A, E, K>(
    self: Source<A, E>,
    keyFn: (a: A) => K,
  ): Source<readonly [source: Source<A, E>, key: K], E> =>
  (_, sink) => {
    const shared: Source<A, E> = share(self)
    const emitted = new Map<K, Source<A, E>>()

    createPipe(shared, sink, {
      onStart: (s) => s.pull(),
      onRequest: (s) => s.pull(),
      onData: (_s, data) => {
        const key = keyFn(data)

        if (!emitted.has(key)) {
          const inner = startWith_(
            filter_(shared, (a) => keyFn(a) === key),
            data,
          )
          emitted.set(key, inner)
          sink(Signal.DATA, [inner, key])
        }
      },
      onEnd: (err) => {
        sink(Signal.END, err)
        emitted.clear()
      },
      onAbort: () => {
        emitted.clear()
      },
    })
  }

export const groupBy =
  <A, K>(keyFn: (a: A) => K) =>
  <E>(self: Source<A, E>): Source<readonly [source: Source<A, E>, key: K], E> =>
    groupBy_(self, keyFn)
