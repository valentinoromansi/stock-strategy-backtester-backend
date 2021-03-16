import { Direction } from "./direction"
import { PriceType } from "../../backtester/types/price-type"
import { GraphEntityType } from "../../backtester/types/graph-entity-type"
import { emaValue, rsiValue, smaValue } from "../../backtester/indicator-calculation"

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
  
  static copy(slice: any): VerticalSlice {
    return new VerticalSlice(slice.time, +slice.open, +slice.close, +slice.high, +slice.low)
  }

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
  executeEachIteration(dir: Direction, iterNum: number, onEachIter: (p: VerticalSlice) => boolean) {
    if (iterNum && (!this.hasConnectedPrices(dir, iterNum) || iterNum <= 0)) return
    let cur: VerticalSlice = this
    let continueIteration = true
    // For defined iteraton num. run onEachIter that many times
    if (iterNum != null) {
      for (let i = 0; i <= iterNum; ++i) {
        continueIteration = onEachIter(cur)
        if (!continueIteration) return
        cur = dir == Direction.LEFT ? cur.prev : cur.next
      }
    }
    // For undefined iteraton num. run onEachIter as many times as there are prices
    else {
      continueIteration = onEachIter(cur)
      if (!continueIteration) return
      while (cur.next) {
        continueIteration = onEachIter(cur)
        if (!continueIteration) return
        cur = cur.next
      }
    }
  }

  static getPriceType(price: VerticalSlice): PriceType {
    if (price.close > price.open) return PriceType.BULLISH
    if (price.close < price.open) return PriceType.BEARISH
    return PriceType.UNDECISIVE
  }

  getAttributeValue(entityType: GraphEntityType, indicatorCalcValue: number = null): number {
    switch (entityType) {
      case GraphEntityType.OPEN:
        return this.open
      case GraphEntityType.CLOSE:
        return this.close
      case GraphEntityType.HIGH:
        return this.high
      case GraphEntityType.LOW:
        return this.low
      case GraphEntityType.SMA:
        return smaValue(indicatorCalcValue, this)
      case GraphEntityType.EMA:
        return emaValue(indicatorCalcValue, this)
      case GraphEntityType.RSI:
        return rsiValue(indicatorCalcValue, this)
      default:
        return 0
    }
  }

}
