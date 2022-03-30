declare module "callbag-start-with" {
  import { Source } from "strict-callbag"

  const startWith: <B>(
    ...bs: B[]
  ) => <A, E>(source: Source<A, E>) => Source<A | B, E>

  export default startWith
}
