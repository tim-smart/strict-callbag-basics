/* eslint-disable @typescript-eslint/no-explicit-any */
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
    options?: unknown,
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
  options?: unknown,
): Source<A, never> =>
  async((sink) => {
    const onData = (a: A) => sink(1, a)

    if ("addListener" in self) {
      self.addListener(event, onData)
    } else if ("addEventListener" in self) {
      self.addEventListener(event, onData, options)
    } else {
      throw new Error("fromEvent: not a valid event emitter")
    }

    return () => {
      if ("removeListener" in self) {
        self.removeListener(event, onData)
      } else {
        self.removeEventListener(event, onData)
      }
    }
  })

export const fromEventBuffered = <A = unknown>(
  self: Emitter,
  event: string,
  bufferSize = 16,
  options?: unknown,
) => buffer_(fromEvent<A>(self, event, options), bufferSize)
