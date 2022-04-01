import "symbol-observable"

export type InteropObservable<T> = {
  [Symbol.observable]: () => Subscribable<T>
}

export type Observer<T> = {
  complete(): void
  error(error: any): void
  next(value: T): void
}

export type PartialObserver<T> = Partial<Observer<T>>

export type Subscribable<T> = {
  subscribe(observer?: PartialObserver<T>): Unsubscribable
}

export type Unsubscribable = {
  unsubscribe(): void
}
