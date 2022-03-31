import cbTAI from "callbag-to-async-iterable"
import { Source } from "strict-callbag"

export const toAsyncIterable = <A>(self: Source<A, any>): AsyncIterable<A> =>
  cbTAI(self)
