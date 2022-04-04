import cbBufferTime from "callbag-buffer-time"
import { Source } from "strict-callbag"

export const batchTime = cbBufferTime
export const batchTime_ = <A, E>(self: Source<A, E>, duration: number) =>
  batchTime(duration)(self)
