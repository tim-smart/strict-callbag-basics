import { Signal, Source, Talkback } from "strict-callbag"

export const drain =
  <E>(self: Source<any, E>): Source<never, E> =>
  (_, sink) => {
    let talkback: Talkback<any>

    return self(Signal.START, (signal, data) => {
      if (signal === Signal.START) {
        talkback = data
      } else if (signal === Signal.DATA) {
        talkback(Signal.DATA)
        return
      }

      sink(signal as any, data as any)
    })
  }
