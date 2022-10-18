import { Source } from "strict-callbag"

import { toAsyncIterable } from "./toAsyncIterable"

interface Reduce {
  /**
   * Calls the specified callback function for all the elements. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.
   * @param reducer A function that accepts up to three arguments. The reduce method calls the reducer function one time for each element.
   * @param initialValue If initialValue is specified, it is used as the initial value to start the accumulation. The first call to the reducer function provides this value as an argument instead of a value.
   * @see
   *  - {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce Array.reduce}
   */
  <T, U = T>(
    reducer: (
      previousValue: U,
      currentValue: T,
      currentIndex: number,
    ) => Promise<U> | U,
  ): (self: Source<T, never>) => Promise<U>

  /**
   * Calls the specified callback function for all the elements. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.
   * @param reducer A function that accepts up to three arguments. The reduce method calls the reducer function one time for each element.
   * @param initialValue If initialValue is specified, it is used as the initial value to start the accumulation. The first call to the reducer function provides this value as an argument instead of a value.
   * @see
   *  - {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce Array.reduce}
   */
  <T, U = T>(
    reducer: (
      previousValue: U,
      currentValue: T,
      currentIndex: number,
    ) => Promise<U> | U,
    initialValue: U,
  ): (self: Source<T, never>) => Promise<U>
}

export const reduce: Reduce =
  <T>(...args: [Parameters<Reduce>[0]] | [Parameters<Reduce>[0], T]) =>
  // TODO: make more callbagie.
  async (self: Source<T, never>): Promise<T> => {
    const [reducer, initialValue] = args

    let index = 0
    let value = initialValue
    for await (const element of toAsyncIterable(self)) {
      if (index === 0 && args.length === 1) {
        value = element
        index++
      } else {
        value = (await reducer(value!, element, index++)) as T
      }
    }
    return value!
  }
