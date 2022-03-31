import { Signal, Source } from "strict-callbag"
import { asyncEmitter } from "./async"
import { buffer } from "./buffer"
import { flatten } from "./flatten"
import { map } from "./map"
import { pipe } from "./pipe"
import { tap } from "./tap"

export const resource =
  <Acc, A, E, E1>(
    initial: Acc,
    project: (
      acc: Acc,
      index: number,
    ) => Source<readonly [Acc | undefined, Source<A, E>], E1>,
  ): Source<A, E | E1> =>
  (_, sink) => {
    let index = 0
    const [emit, source] = asyncEmitter<
      Source<readonly [Acc | undefined, Source<A, E>], E1>,
      never
    >()

    emit.data(project(initial, index++))

    pipe(
      source,
      flatten,
      buffer(1),
      tap(([acc]) => (acc ? emit.data(project(acc, index++)) : emit.end())),
      map(([_acc, source]) => source),
      flatten,
    )(Signal.START, sink)
  }
