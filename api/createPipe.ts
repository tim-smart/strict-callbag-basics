import { Signal, Sink, Source, Talkback } from "strict-callbag"
import { subscribe, Subscription } from "./subscribe"

interface Callbacks<A, EI, EO> {
  onStart: (sub: Subscription) => void
  onData: (sub: Subscription, data: A) => void
  onEnd: (err?: EI) => void

  onRequest: (sub: Subscription) => void
  onAbort: (err?: EO) => void

  talkbackOverride?: (original: Talkback<any>) => Talkback<any>
}

/**
 * Helper for reducing boilerplate when creating operators
 */
export const createPipe = <A, EI, EO = never>(
  source: Source<A, EI>,
  sink: Sink<any, EI, EO>,
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

  sink(Signal.START, (signal, err) => {
    if (signal === Signal.DATA) {
      if (!sub) {
        sub = subscribe(source, {
          onStart() {
            onStart(sub)
          },
          onData(data) {
            onData(sub, data)
          },
          onEnd(err) {
            onEnd(err)
          },
          talkbackOverride,
        })

        sub.listen()
      } else {
        onRequest(sub)
      }
    } else if (Signal.END) {
      sub?.cancel()
      onAbort(err)
    }
  })
}
