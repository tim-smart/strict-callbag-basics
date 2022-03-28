import { Signal, Source } from "strict-callbag"
import { subscribe } from "./subscribe"

const NONE = Symbol()
type NONE = typeof NONE

export interface ZipOptions {
  latest?: boolean
}

export const zip_ =
  <A, B, E, E1>(
    self: Source<A, E>,
    other: Source<B, E1>,
    { latest = false }: ZipOptions = {},
  ): Source<readonly [A, B], E | E1> =>
  (_, sink) => {
    let dataA: A | NONE = NONE
    let dataB: B | NONE = NONE
    let endA = false
    let endB = false

    const maybeEmit = () => {
      if (dataA !== NONE && dataB !== NONE) {
        sink(Signal.DATA, [dataA, dataB])

        if (!latest) {
          dataA = NONE
          dataB = NONE
        }
      }
    }

    const maybeEnd = () => {
      if (endA && endB) {
        sink(Signal.END, undefined)
      }
    }

    const subA = subscribe(self, {
      onStart() {
        subA.pull()
      },
      onData(data) {
        dataA = data
        maybeEmit()
      },
      onEnd(err) {
        endA = true

        if (err || !latest) {
          subB.cancel()
          sink(Signal.END, err)
        } else {
          maybeEnd()
        }
      },
    })
    const subB = subscribe(other, {
      onStart() {
        subB.pull()
      },
      onData(data) {
        dataB = data
        maybeEmit()
      },
      onEnd(err) {
        endB = true

        if (err || !latest) {
          subA.cancel()
          sink(Signal.END, err)
        } else {
          maybeEnd()
        }
      },
    })

    let started = false
    sink(Signal.START, (signal) => {
      if (signal === Signal.DATA) {
        if (!started) {
          started = true
          subA.listen()
          subB.listen()
        } else {
          subA.pull()
          subB.pull()
        }
      } else if (signal === Signal.END) {
        subA.cancel()
        subB.cancel()
      }
    })
  }

export const zip =
  <B, E1>(other: Source<B, E1>, opts?: ZipOptions) =>
  <A, E>(self: Source<A, E>) =>
    zip_(self, other, opts)
