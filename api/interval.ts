import cbInterval from "callbag-interval"
import { Source } from "strict-callbag"

export const interval = (ms: number): Source<number, never> =>
  (cbInterval as any)(ms)
