import { NONE } from "../none"

export class Queue<A> {
  private elements: A[] = []
  private index = 0
  public size = 0

  constructor(private capacity?: number) {}

  clear() {
    this.elements = []
    this.index = 0
    this.size = 0
  }

  push(a: A) {
    if (this.capacity !== undefined && this.size >= this.capacity) {
      return
    }

    this.elements.push(a)
    this.size++
  }

  shift() {
    if (this.size === 0) {
      return NONE
    }

    const index = this.index
    const element = this.elements[index]
    this.elements[index] = undefined as any // eslint-disable-line

    if (this.size === 1) {
      this.elements = []
      this.index = 0
      this.size = 0
    } else {
      this.index = index + 1
      this.size--
    }

    return element
  }
}
