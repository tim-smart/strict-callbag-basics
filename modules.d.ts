declare module "callbag-start-with" {
  import { Source } from "strict-callbag"

  const startWith: <B>(
    ...bs: B[]
  ) => <A, E>(source: Source<A, E>) => Source<A | B, E>

  export default startWith
}

declare module "callbag-to-async-iterable" {
  import { Source } from "strict-callbag"

  const toAsyncIterable: <A>(self: Source<A, unknown>) => AsyncIterable<A>

  export default toAsyncIterable
}

declare module "callbag-from-obs" {
  import { Source } from "strict-callbag"
  import { InteropObservable } from "./api/_internal/observable"

  const fromObservable: <A>(obs: InteropObservable<A>) => Source<A, unknown>

  export default fromObservable
}

declare module "callbag-buffer" {
  import { Source } from "strict-callbag"

  const buffer: (
    seperator: Source<unknown, never>,
  ) => <A, E>(source: Source<A, E>) => Source<A, E>

  export default buffer
}

declare module "callbag-buffer-time" {
  import { Source } from "strict-callbag"

  const bufferTime: (
    duration: number,
  ) => <A, E>(source: Source<A, E>) => Source<A, E>

  export default bufferTime
}
