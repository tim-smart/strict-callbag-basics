let actions: (() => void)[] = []
let count = 0
let running = false
export function schedule(f: () => void) {
  if (running) {
    actions.push(f)
    count++
  } else {
    running = true
    f()

    if (count > 0) {
      for (let i = 0; i < count; i++) {
        actions[i]()
      }

      actions = []
      count = 0
    }

    running = false
  }
}
