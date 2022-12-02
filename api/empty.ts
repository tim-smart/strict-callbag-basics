import { error } from "./error.js"

export const empty = error<never>(undefined as never)
