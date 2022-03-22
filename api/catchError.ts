import { Source, Signal, Talkback } from "strict-callbag"

export const catchError_ =
  <A, B, E, E1>(
    self: Source<A, E>,
    onError: (e: E) => Source<B, E1>,
  ): Source<A | B, E | E1> =>
  (_, sink) => {
    let innerTalkback: Talkback<any>
    const talkback: Talkback<any> = (signal) => innerTalkback(signal)

    const replaceSource = (source: Source<A | B, E | E1>, initial = false) => {
      source(Signal.START, (t, d) => {
        if (t === Signal.START) {
          innerTalkback = d

          if (initial) {
            sink(Signal.START, talkback)
          }

          talkback(Signal.DATA)
        } else if (initial && t === Signal.END && d !== undefined) {
          replaceSource(onError(d as E))
        } else {
          sink(t, d as any)
        }
      })
    }

    replaceSource(self, true)
  }

export const catchError =
  <B, E, E1>(onError: (e: E) => Source<B, E1>) =>
  <A>(self: Source<A, E>): Source<A | B, E | E1> =>
    catchError_(self, onError)
