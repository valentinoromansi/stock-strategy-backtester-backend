import { Direction } from "./direction"
import { PriceType } from "../../backtester/types/price-type"

/**
 * Vertical slice includes all attributes and values on given date
 * It consists of: 
 *  1.) Date and time
 *  2.) Price attributes - low, high, open, close
 *  3.) Indicator value
 */
export class VerticalSlice {

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
  next: VerticalSlice
  prev: VerticalSlice

  hasConnectedPrices(dir: Direction, iterNum: number): boolean {
    if (iterNum == 0) return false
    let cur: VerticalSlice = this
    for (let i = 0; i < iterNum; ++i) {
      if (dir === Direction.LEFT && !cur.prev) return false
      if (dir === Direction.RIGHT && !cur.next) return false
      cur = dir === Direction.LEFT ? cur.prev : cur.next
    }
    return true
  }

  getConnectedPrice(dir: Direction, iterNum: number): VerticalSlice {
    if (iterNum == 0) return this
    if (!this.hasConnectedPrices(dir, iterNum) || iterNum < 0) return null
    let cur: VerticalSlice = this
    for (let i = 0; i < iterNum; ++i) {
      cur = dir == Direction.LEFT ? cur.prev : cur.next
    }
    return cur
  }

  /**
   * Moves from this vertical slice in 'dir' direction 'iterNum' number of times and executes 'onEachIter' for each slice.
   * If iteration number is not specified it iterates in given direction until last slice is reached
   */
  executeEachIteration(dir: Direction, iterNum: number, onEachIter: (p: VerticalSlice) => any) {
    if (iterNum && (!this.hasConnectedPrices(dir, iterNum) || iterNum <= 0)) return
    let cur: VerticalSlice = this
    // For defined iteraton num. run onEachIter that many times
    if (iterNum != null) {
      for (let i = 0; i <= iterNum; ++i) {
        onEachIter(cur)
        cur = dir == Direction.LEFT ? cur.prev : cur.next
      }
    }
    // For undefined iteraton num. run onEachIter as many times as there are prices
    else {
      onEachIter(cur)
      while (cur.next) {
        onEachIter(cur)
        cur = cur.next
      }
    }
  }

  static getPriceType(price: VerticalSlice): PriceType {
    if (price.close > price.open) return PriceType.BULLISH
    if (price.close < price.open) return PriceType.BEARISH
    return PriceType.UNDECISIVE
  }
}
