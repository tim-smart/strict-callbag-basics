import { Signal, Source } from "strict-callbag"
import { buffer_ } from "./buffer"
import { createPipe } from "./createPipe"
import { Subscription } from "./subscribe"
import * as LB from "./_internal/lb"

/**
 * A semi-push stream.
 *
 * It eagerly loads items until the `concurrency` target is met.
 */
export const chainParP_ =
  <E, E1, A, B>(
    self: Source<A, E>,
    fab: (a: A) => Source<B, E1>,
    concurrency = Infinity,
  ): Source<B, E | E1> =>
  (_, sink) => {
    const lb = LB.make<E | E1, B>(
      (a) => sink(Signal.DATA, a),
      (e) => sink(Signal.END, e),
      maybePullInner,
      maybePullInner,
    )

    let sub: Subscription

    function maybePullInner() {
      if (sub && lb.size() < concurrency) {
        sub.pull()
      }
    }

    createPipe(self, sink, {
      onStart(s) {
        sub = s
        maybePullInner()
      },

      onData(_, data) {
        const inner = fab(data)
        lb.add(inner)
        maybePullInner()
      },

      onEnd: lb.end,
      onRequest: lb.pull,
      onAbort() {
        lb.abort()
      },
    })
  }

export const chainPar_ = <E, E1, A, B>(
  self: Source<A, E>,
  fab: (a: A) => Source<B, E1>,
  concurrency?: number,
  bufferSize?: number,
) => buffer_(chainParP_(self, fab, concurrency), bufferSize, true)

export const chainParP =
  <E1, A, B>(fab: (a: A) => Source<B, E1>, concurrency?: number) =>
  <E>(self: Source<A, E>) =>
    chainParP_(self, fab, concurrency)

export const chainPar =
  <E1, A, B>(
    fab: (a: A) => Source<B, E1>,
    concurrency?: number,
    bufferSize?: number,
  ) =>
  <E>(self: Source<A, E>) =>
    chainPar_(self, fab, concurrency, bufferSize)
