import { Source } from "strict-callbag"

import { subscribe } from "./subscribe"

/**
 * Calls the specified callback function for all the elements. The return value
 * of the callback function is the accumulated result, and is provided as an
 * argument in the next call to the callback function.
 * @param reducer A function that accepts up to three arguments. The reduce
 * method calls the reducer function one time for each element.
 * @see
 *  - {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce Array.reduce}
 */
export function reduce_<A>(
  self: Source<A, any>,
  reducer: (previousValue: A, item: A, index: number) => A,
): Promise<A>

/**
 * Calls the specified callback function for all the elements. The return value
 * of the callback function is the accumulated result, and is provided as an
 * argument in the next call to the callback function.
 * @param reducer A function that accepts up to three arguments. The reduce
 * method calls the reducer function one time for each element.
 * @param initialValue If initialValue is specified, it is used as the initial
 * value to start the accumulation. The first call to the reducer function
 * provides this value as an argument instead of a value.
 * @see
 *  - {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce Array.reduce}
 */
export function reduce_<A, Acc>(
  self: Source<A, any>,
  reducer: (previousValue: Acc, item: A, index: number) => Acc,
  initialValue: Acc,
): Promise<Acc>

export function reduce_<A, Acc = A>(
  ...args:
    | [self: Source<A, any>, reducer: (acc: Acc, item: A, index: number) => Acc]
    | [
        self: Source<A, any>,
        reducer: (acc: Acc, item: A, index: number) => Acc,
        initialValue: Acc,
      ]
) {
  return new Promise((resolve, reject) => {
    const hasInitialValue = args.length === 3
    const [self, reducer] = args
    let [, , accumulator] = args
    let index = 0

    const sub = subscribe(self, {
      onStart() {
        sub.pull()
      },
      onData(data) {
        if (index === 0 && !hasInitialValue) {
          accumulator = data as unknown as Acc
          index++
        } else {
          accumulator = reducer(accumulator!, data, index++)
        }

        sub.pull()
      },
      onEnd(err) {
        if (err) {
          reject(err)
        } else if (!hasInitialValue && index === 0) {
          reject(new TypeError("Reduce of empty source with no initial value"))
        } else {
          resolve(accumulator!)
        }
      },
    })

    sub.listen()
  })
}

/**
 * Calls the specified callback function for all the elements. The return value
 * of the callback function is the accumulated result, and is provided as an
 * argument in the next call to the callback function.
 * @param reducer A function that accepts up to three arguments. The reduce
 * method calls the reducer function one time for each element.
 * @see
 *  - {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce Array.reduce}
 */
export function reduce<A>(
  reducer: (acc: A, item: A, index: number) => A,
): (self: Source<A, any>) => Promise<A>

/**
 * Calls the specified callback function for all the elements. The return value
 * of the callback function is the accumulated result, and is provided as an
 * argument in the next call to the callback function.
 * @param reducer A function that accepts up to three arguments. The reduce
 * method calls the reducer function one time for each element.
 * @param initialValue If initialValue is specified, it is used as the initial
 * value to start the accumulation. The first call to the reducer function
 * provides this value as an argument instead of a value.
 * @see
 *  - {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce Array.reduce}
 */
export function reduce<A, Acc = A>(
  reducer: (previousValue: Acc, item: A, index: number) => Acc,
  initialValue: Acc,
): (self: Source<A, any>) => Promise<Acc>

export function reduce(...args: [any]) {
  return (self: Source<any, any>) => {
    return reduce_(self, ...args)
  }
}
