import { Source } from "strict-callbag"
import { async } from "./async"
import { buffer_ } from "./buffer"

interface NodeishEmitter {
  addListener(eventName: string, listener: (...args: any[]) => unknown): unknown
  removeListener(
    eventName: string,
    listener: (...args: any[]) => unknown,
  ): unknown
}

interface DomishEmitter {
  addEventListener(
    eventName: string,
    listener: (...args: any[]) => unknown,
    options?: boolean | AddEventListenerOptions,
  ): unknown
  removeEventListener(
    eventName: string,
    listener: (...args: any[]) => unknown,
  ): unknown
}

type Emitter = NodeishEmitter | DomishEmitter

export const fromEvent = <A = unknown>(
  self: Emitter,
  event: string,
  options?: boolean | AddEventListenerOptions,
): Source<A, never> =>
  async((emit) => {
    if ("addListener" in self) {
      self.addListener(event, emit.data)
    } else if ("addEventListener" in self) {
      self.addEventListener(event, emit.data, options)
    } else {
      throw new Error("fromEvent: not a valid event emitter")
    }

    return () => {
      if ("removeListener" in self) {
        self.removeListener(event, emit.data)
      } else {
        self.removeEventListener(event, emit.data)
      }
    }
  })

export const fromEventBuffered = <A = unknown>(
  self: Emitter,
  event: string,
  bufferSize = 16,
  options?: boolean | AddEventListenerOptions,
) => buffer_(fromEvent<A>(self, event, options), bufferSize)
