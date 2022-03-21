declare module "callbag-start-with" {
  import { Source } from "strict-callbag";

  const startWith: <A>(...as: A[]) => <E>(source: Source<A, E>) => Source<A, E>;

  export default startWith;
}
