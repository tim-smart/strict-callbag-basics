import { Signal, Source } from "strict-callbag"
import * as LB from "./_internal/lb"

export const merge_ =
  <A, B, E, E1>(
    self: Source<A, E>,
    other: Source<B, E1>,
  ): Source<A | B, E | E1> =>
  (_, sink) => {
    const lb = LB.make<E | E1, A | B>(
      (data) => sink(Signal.DATA, data),
      (err) => sink(Signal.END, err),
      () => {
        lb.pull()
      },
    )

    let started = false
    sink(Signal.START, (signal) => {
      if (signal === Signal.DATA) {
        if (started) {
          lb.pull()
        } else {
          started = true
          lb.add(self)
          lb.add(other)
          lb.end()
        }
      } else if (signal === Signal.END) {
        lb.abort()
      }
    })
  }

export const merge =
  <B, E1>(other: Source<B, E1>) =>
  <A, E>(self: Source<A, E>) =>
    merge_(self, other)
