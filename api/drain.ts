import { Source, Talkback } from "strict-callbag"

export const drain =
  <E>(self: Source<any, E>): Source<never, E> =>
  (_, sink) => {
    let talkback: Talkback<any>

    return self(0, (signal, data) => {
      if (signal === 0) {
        talkback = data
      } else if (signal === 1) {
        talkback(1)
        return
      }

      sink(signal as any, data as any)
    })
  }
