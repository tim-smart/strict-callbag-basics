import { suite, add, cycle, complete } from "benny"
import * as CB from "../"
import * as Rx from "rxjs"
import * as RxO from "rxjs/operators"

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
  cycle(),
  complete(),
)
