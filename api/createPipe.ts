import { Sink, Source, Talkback } from "strict-callbag"
import { subscribe, Subscription } from "./subscribe"

interface Callbacks<A, EI, EO> {
  onStart: (this: void, sub: Subscription) => void
  onData: (this: void, sub: Subscription, data: A) => void
  onEnd: (this: void, err?: EI) => void

  onRequest: (this: void, sub: Subscription) => void
  onAbort: (this: void, err?: EO) => void

  talkbackOverride?: (
    this: void,
    original: Talkback<unknown>,
  ) => Talkback<unknown>
}

/**
 * Helper for reducing boilerplate when creating operators
 */
export const createPipe = <A, EI, EO = never>(
  source: Source<A, EI>,
  sink: Sink<any, EI, EO>, // eslint-disable-line
  {
    onStart,
    onData,
    onEnd,

    onRequest,
    onAbort,

    talkbackOverride,
  }: Callbacks<A, EI, EO>,
) => {
  let sub: Subscription

  sink(0, (signal, err) => {
    if (signal === 1) {
      if (sub === undefined) {
        sub = subscribe(source, {
          onStart() {
            onStart(sub)
          },
          onData(data) {
            onData(sub, data)
          },
          onEnd,
          talkbackOverride,
        })

        sub.listen()
      } else {
        onRequest(sub)
      }
    } else if (2) {
      sub?.cancel()
      onAbort(err)
    }
  })
}
