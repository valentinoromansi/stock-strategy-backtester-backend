import { Direction } from "./direction"
import { PriceLinkedList } from "./price-linked-list"

export class Price {
  constructor(time: Date, open: number, close: number, high: number, low: number) {
    this.time = time
    this.open = open
    this.close = close
    this.high = high
    this.low = low
  }

  time: Date
  open: number
  close: number
  high: number
  low: number
  next: Price
  prev: Price

  hasConnectedPrices(dir: Direction, iterNum: number): boolean {
    if (iterNum == 0) return false
    let cur: Price = this
    for (let i = 0; i < iterNum; ++i) {
      if (dir === Direction.LEFT && !cur.prev) return false
      if (dir === Direction.RIGHT && !cur.next) return false
      cur = dir === Direction.LEFT ? cur.prev : cur.next
    }
    return true
  }

  getConnectedPrice(dir: Direction, iterNum: number): Price {
    if (iterNum == 0) return this
    if (!this.hasConnectedPrices(dir, iterNum) || iterNum < 0) return null
    let cur: Price = this
    for (let i = 0; i < iterNum; ++i) {
      cur = dir == Direction.LEFT ? cur.prev : cur.next
    }
    return cur
  }

  // Includes onEachIter for current given price
  executeEachIteration(dir: Direction, iterNum: number, onEachIter: (p: Price) => any) {
    if (!this.hasConnectedPrices(dir, iterNum) || iterNum <= 0) return
    let cur: Price = this
    for (let i = 0; i <= iterNum; ++i) {
      onEachIter(cur)
      cur = dir == Direction.LEFT ? cur.prev : cur.next
    }
  }
}
