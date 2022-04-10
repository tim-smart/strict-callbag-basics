import { Sink, Talkback } from "strict-callbag"

// eslint-disable-next-line
export const noop = (): Sink<any, any, never> => {
  let talkback: Talkback<never>

  return (signal, data) => {
    if (signal === 0) {
      talkback = data
      talkback(1)
    } else if (signal === 1) {
      talkback(1)
    }
  }
}
