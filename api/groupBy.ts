import { Source } from "strict-callbag"
import { buffer, buffer_ } from "./buffer.js"
import { createPipe } from "./createPipe.js"
import { filter } from "./filter.js"
import { pipe } from "./pipe.js"
import { share } from "./share.js"
import { startWith } from "./startWith.js"

export const groupBy_ =
  <A, E, K>(
    self: Source<A, E>,
    keyFn: (a: A) => K,
    bufferSize = Infinity,
  ): Source<readonly [source: Source<A, E>, key: K, data: A], E> =>
  (_, sink) => {
    const shared: Source<A, E> = share(self)
    const emitted = new Map<K, Source<A, E>>()

    createPipe(shared, sink, {
      onStart: (s) => s.pull(),
      onRequest: (s) => s.pull(),
      onData: (_s, data) => {
        const key = keyFn(data)

        if (!emitted.has(key)) {
          const inner = pipe(
            shared,
            filter((a) => keyFn(a) === key),
            startWith(data),
          )
          const innerBuffered =
            bufferSize > 0 ? buffer_(inner, bufferSize) : inner
          emitted.set(key, innerBuffered)
          sink(1, [innerBuffered, key, data])
        }
      },
      onEnd: (err) => {
        sink(2, err)
        emitted.clear()
      },
      onAbort: () => {
        emitted.clear()
      },
    })
  }

export const groupBy =
  <A, K>(keyFn: (a: A) => K, bufferSize?: number) =>
  <E>(self: Source<A, E>) =>
    groupBy_(self, keyFn, bufferSize)
