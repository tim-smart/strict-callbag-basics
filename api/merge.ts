import { Signal, Source } from "strict-callbag"
import * as LB from "./_internal/lb"

export const mergeIdentical =
  <A, E>(...sources: Source<A, E>[]): Source<A, E> =>
  (_, sink) => {
    const lb = LB.make<E, A>(
      (data) => sink(Signal.DATA, data),
      (err) => sink(Signal.END, err),
      () => {
        //
      },
    )

    let started = false
    sink(Signal.START, (signal) => {
      if (signal === Signal.DATA) {
        if (started) {
          lb.pull()
        } else {
          started = true
          sources.forEach((s) => lb.add(s))
          lb.end()
        }
      } else if (signal === Signal.END) {
        lb.abort()
      }
    })
  }

export const merge_ = <A, B, E, E1>(
  self: Source<A, E>,
  other: Source<B, E1>,
): Source<A | B, E | E1> => mergeIdentical(self, other as Source<A, E>)

export const merge =
  <B, E1>(other: Source<B, E1>) =>
  <A, E>(self: Source<A, E>) =>
    merge_(self, other)
