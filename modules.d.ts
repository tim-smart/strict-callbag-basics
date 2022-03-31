declare module "callbag-start-with" {
  import { Source } from "strict-callbag"

  const startWith: <B>(
    ...bs: B[]
  ) => <A, E>(source: Source<A, E>) => Source<A | B, E>

  export default startWith
}

declare module "callbag-to-async-iterable" {
  import { Source } from "strict-callbag"

  const toAsyncIterable: <A>(self: Source<A, any>) => AsyncIterable<A>

  export default toAsyncIterable
}
