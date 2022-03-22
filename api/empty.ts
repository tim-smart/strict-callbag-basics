import { error } from "./error"

export const empty = error<never>(undefined as never)
