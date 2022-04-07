import { Signal, Source } from "strict-callbag"
import { createPipe } from "./createPipe"
import { Subscription } from "./subscribe"
import * as LB from "./_internal/lb"

export const chainPar_ =
  <E, E1, A, B>(
    self: Source<A, E>,
    fab: (a: A) => Source<B, E1>,
    concurrency = Infinity,
  ): Source<B, E | E1> =>
  (_, sink) => {
    const lb = LB.make<E | E1, B>(
      (a) => sink(Signal.DATA, a),
      (e) => sink(Signal.END, e),
      () => maybePullInner(),
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
        lb.pull()
        maybePullInner()
      },

      onData(_, data) {
        const inner = fab(data)
        lb.add(inner)
      },

      onEnd(err) {
        lb.end(err)
      },

      onRequest() {
        if (lb.idle() === 0) {
          maybePullInner()
        } else {
          lb.pull()
        }
      },

      onAbort() {
        lb.abort()
      },
    })
  }
export const chainPar =
  <E1, A, B>(fab: (a: A) => Source<B, E1>, concurrency?: number) =>
  <E>(self: Source<A, E>): Source<B, E | E1> =>
    chainPar_(self, fab, concurrency)
