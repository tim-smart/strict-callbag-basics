import { Source } from "strict-callbag"

const noop = () => {}

export const never: Source<never, never> = (_, sink) => sink(0, noop)
