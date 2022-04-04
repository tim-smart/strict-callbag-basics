import cbBuffer from "callbag-buffer"
import { Source } from "strict-callbag"

export const batch = cbBuffer
export const batch_ = <A, E>(
  self: Source<A, E>,
  seperator: Source<unknown, never>,
) => batch(seperator)(self)
