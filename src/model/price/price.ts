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
    let counter = 0
    let cur: Price = this
    while (counter != iterNum) {
      if (dir === Direction.LEFT && !cur.prev) return false
      if (dir === Direction.RIGHT && !cur.next) return false
      cur = dir === Direction.LEFT ? cur.prev : cur.next
      counter++
    }
    return true
  }

  executeEachIteration(dir: Direction, iterNum: number, onEachIter: (p: Price) => any) {
    if (!this.hasConnectedPrices(dir, iterNum)) return
    let cur: Price = this
    for (let i = 0; i <= iterNum; ++i) {
      onEachIter(cur)
      cur = dir == Direction.LEFT ? cur.prev : cur.next
    }
  }
}

let prices: PriceLinkedList = new PriceLinkedList()

prices.append(new Price(new Date(), 1, 1, 1, 1))
prices.append(new Price(new Date(), 2, 2, 2, 2))
prices.last.executeEachIteration(Direction.LEFT, 1, (price: Price) => {
  console.log(price.low)
})
