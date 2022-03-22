import { Signal, Source } from "strict-callbag"

const noop = () => {}

export const never: Source<never, never> = (_, sink) => sink(Signal.START, noop)
