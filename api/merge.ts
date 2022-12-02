import { Source } from "strict-callbag"
import * as LB from "./_internal/lb.js"

export const mergeIdentical =
  <A, E>(...sources: Source<A, E>[]): Source<A, E> =>
  (_, sink) => {
    const lb = LB.make<E, A>(
      (data) => sink(1, data),
      (err) => sink(2, err),
      () => {
        //
      },
    )

    let started = false
    sink(0, (signal) => {
      if (signal === 1) {
        if (started) {
          lb.pull()
        } else {
          started = true
          sources.forEach((s) => lb.add(s))
          lb.end()
        }
      } else if (signal === 2) {
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
