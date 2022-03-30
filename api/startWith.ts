/// <reference path="../modules.d.ts" />

import StartWith from "callbag-start-with"
import { Source } from "strict-callbag"

export const startWith = StartWith
export const startWith_ = <A, B, E>(self: Source<A, E>, ...bs: B[]) =>
  startWith(...bs)(self)
