import { Source, Talkback } from "strict-callbag"
import { schedule } from "./_internal/schedule"

interface Callbacks<A, E> {
  onStart: (this: void) => void
  onData: (this: void, data: A) => void
  onEnd: (this: void, err?: E) => void

  talkbackOverride?: (original: Talkback<any>) => Talkback<any>
}

export class Subscription {
  private aborted = false
  private pullPending = false
  private talkback: Talkback<any> | undefined
  private onCancel: (() => void) | undefined
  private waitingForData = false

  constructor(
    private source: Source<any>,
    private callbacks: Callbacks<any, any>,
  ) {}

  listen() {
    this.source(0, (signal, data) => {
      if (this.aborted) {
        if (signal === 0) {
          data(2)
          this.onCancel?.()
        }
        return
      }

      if (signal === 0) {
        this.talkback = this.callbacks.talkbackOverride
          ? this.callbacks.talkbackOverride(data)
          : data

        if (this.pullPending) {
          this.talkback!(1) // eslint-disable-line
        }

        this.callbacks.onStart()
      } else if (signal === 1) {
        this.waitingForData = false
        this.callbacks.onData(data)
      } else if (signal === 2) {
        this.aborted = true
        schedule(() => this.callbacks.onEnd(data))
      }
    })
  }

  cancel(cb?: () => void) {
    if (this.aborted) return

    this.aborted = true
    this.onCancel = cb

    if (this.talkback) {
      this.talkback(2)
      this.onCancel?.()
    }
  }

  pull() {
    if (this.aborted) return

    this.waitingForData = true

    if (this.talkback) {
      this.talkback(1)
    } else {
      this.pullPending = true
    }
  }

  waiting() {
    return this.waitingForData
  }
}

export const subscribe = <A, E>(
  source: Source<A, E>,
  callbacks: Callbacks<A, E>,
) => new Subscription(source, callbacks)
