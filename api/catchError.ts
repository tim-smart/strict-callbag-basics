import { Source, Talkback } from "strict-callbag"

export const catchError_ =
  <A, B, E, E1>(
    self: Source<A, E>,
    onError: (e: E) => Source<B, E1>,
  ): Source<A | B, E1> =>
  (_, sink) => {
    let innerTalkback: Talkback<any>
    const talkback: Talkback<any> = (signal) => innerTalkback(signal)

    const replaceSource = (source: Source<A | B, E | E1>, initial = false) => {
      source(0, (t, d) => {
        if (t === 0) {
          innerTalkback = d

          if (initial) {
            sink(0, talkback)
          }

          talkback(1)
        } else if (initial && t === 2 && d !== undefined) {
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
  <A>(self: Source<A, E>) =>
    catchError_(self, onError)
