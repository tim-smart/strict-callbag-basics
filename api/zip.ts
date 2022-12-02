import { Source } from "strict-callbag"
import { subscribe } from "./subscribe.js"

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
        sink(1, [dataA, dataB])

        if (!latest) {
          dataA = NONE
          dataB = NONE

          if (endA || endB) {
            if (!endA) subB.cancel()
            if (!endB) subA.cancel()
            sink(2, undefined)
          }
        }
      }
    }

    const maybeEnd = () => {
      if (endA && endB) {
        sink(2, undefined)
      } else if (!latest && dataA === NONE && dataB === NONE) {
        sink(2, undefined)
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

        if (err) {
          subB.cancel()
          sink(2, err)
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

        if (err) {
          subA.cancel()
          sink(2, err)
        } else {
          maybeEnd()
        }
      },
    })

    let started = false
    sink(0, (signal) => {
      if (signal === 1) {
        if (!started) {
          started = true
          subA.listen()
          subB.listen()
        } else {
          subA.pull()
          subB.pull()
        }
      } else if (signal === 2) {
        subA.cancel()
        subB.cancel()
      }
    })
  }

export const zip =
  <B, E1>(other: Source<B, E1>, opts?: ZipOptions) =>
  <A, E>(self: Source<A, E>) =>
    zip_(self, other, opts)
