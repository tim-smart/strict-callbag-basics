import { Signal, Sink, Talkback } from "strict-callbag"

// eslint-disable-next-line
export const noop = (): Sink<any, any, never> => {
  let talkback: Talkback<never>

  return (signal, data) => {
    if (signal === Signal.START) {
      talkback = data
      talkback(Signal.DATA)
    } else if (signal === Signal.DATA) {
      talkback(Signal.DATA)
    }
  }
}
