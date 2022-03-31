import { suite, add, cycle, complete } from "benny"
import * as CB from "../"
import * as Rx from "rxjs"
import * as RxO from "rxjs/operators"
import * as S from "@effect-ts/core/Effect/Experimental/Stream"
import * as T from "@effect-ts/core/Effect"
import * as Ix from "ix/asynciterable"
import * as IxO from "ix/asynciterable/operators"

const array = Array.from(Array(100000).keys())

suite(
  "dataflow",
  add("callbag", async () => {
    const counts = CB.fromIter(array)
    const twos = CB.filter_(counts, (i) => i % 2 === 0)
    const threes = CB.filter_(counts, (i) => i % 3 === 0)
    const merged = CB.merge_(twos, threes)
    const labeled = CB.chain_(merged, (i) => CB.of(`Got: ${i}`))

    await CB.run_(labeled)
  }),
  add("rxjs", async () => {
    const counts = Rx.from(array)
    const twos = counts.pipe(RxO.filter((i) => i % 2 === 0))
    const threes = counts.pipe(RxO.filter((i) => i % 3 === 0))
    const merged = Rx.merge(twos, threes)
    const labeled = merged.pipe(RxO.flatMap((i) => Rx.of(`Got: ${i}`)))

    await Rx.lastValueFrom(labeled)
  }),
  add("ix", async () => {
    const counts = Ix.from(array)
    const twos = counts.pipe(IxO.filter((i) => i % 2 === 0))
    const threes = counts.pipe(IxO.filter((i) => i % 3 === 0))
    const merged = Ix.merge(twos, threes)
    const labeled = merged.pipe(IxO.flatMap((i) => Ix.of(`Got: ${i}`)))

    await Ix.last(labeled)
  }),
  add("@effect-ts/core", async () => {
    const counts = S.fromIterable(array)
    const twos = S.filter_(counts, (i) => i % 2 === 0)
    const threes = S.filter_(counts, (i) => i % 3 === 0)
    const merged = S.merge_(twos, threes)
    const labeled = S.chain_(merged, (i) => S.fromIterable([`Got: ${i}`]))

    await T.runPromise(S.runDrain(labeled))
  }),
  cycle(),
  complete(),
)
