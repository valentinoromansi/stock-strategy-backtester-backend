import { Direction } from "../types/direction"
import { TrendType } from "../types/trend-type"
import { AttributeType } from "../types/attribute-type"
import { emaValue, rsiValue, smaValue } from "../indicator/indicator-calculation"
import { RelativeAttributeValueData, RelativeAttributeValueSource } from "../strategy/relative-attribute-data"

/**
 * Vertical slice includes all attributes and values on given date
 * It consists of:
 *  1.) Date and time
 *  2.) Price attributes - low, high, open, close
 *  3.) Indicator value
 */
export class VerticalSlice {
  constructor(date: Date, open: number, close: number, high: number, low: number, volume: number) {
    this.date = date
    this.open = +open
    this.close = +close
    this.high = +high
    this.low = +low
    this.volume = +volume
  }

  date: Date
  open: number
  close: number
  high: number
  low: number
  volume: number
  next: VerticalSlice
  prev: VerticalSlice

  static copy(data: any): VerticalSlice {
    return new VerticalSlice(new Date(data.time), +data.open, +data.close, +data.high, +data.low, +data.volume)
  }

  hasConnectedPrices(dir: Direction, iterNum: number): boolean {
    if (iterNum == 0) return false
    let curSlice: VerticalSlice = this
    for (let i = 0; i < iterNum; ++i) {
      if (dir === Direction.LEFT && !curSlice.prev) return false
      if (dir === Direction.RIGHT && !curSlice.next) return false
      curSlice = dir === Direction.LEFT ? curSlice.prev : curSlice.next
    }
    return true
  }

  getConnectedPrice(dir: Direction, iterNum: number): VerticalSlice {
    if (iterNum == 0) return this
    if (!this.hasConnectedPrices(dir, iterNum) || iterNum < 0) return null
    let curSlice: VerticalSlice = this
    for (let i = 0; i < iterNum; ++i) {
      curSlice = dir == Direction.LEFT ? curSlice.prev : curSlice.next
    }
    return curSlice
  }

  /**
   * Moves from this vertical slice in 'dir' direction 'iterNum' number of times and executes 'onEachIter' for each slice.
   * If iteration number is not specified it iterates in given direction until last slice is reached
   */
  executeEachIteration(dir: Direction, iterNum: number, onEachIter: (p: VerticalSlice) => boolean) {
    if (iterNum && (!this.hasConnectedPrices(dir, iterNum) || iterNum <= 0)) return
    let curSlice: VerticalSlice = this
    let continueIteration = true
    // For defined iteraton num. run onEachIter that many times
    if (iterNum != null) {
      for (let i = 0; i <= iterNum; ++i) {
        continueIteration = onEachIter(curSlice)
        if (!continueIteration) return
        curSlice = dir == Direction.LEFT ? curSlice.prev : curSlice.next
      }
    }
    // For undefined iteraton num. run onEachIter as many times as there are prices
    else {
      continueIteration = onEachIter(curSlice)
      if (!continueIteration) return
      while (curSlice.next) {
        continueIteration = onEachIter(curSlice)
        if (!continueIteration) return
        curSlice = curSlice.next
      }
    }
  }

  static getTrendType(slice: VerticalSlice): TrendType {
    if (slice.close > slice.open) return TrendType.BULLISH
    if (slice.close < slice.open) return TrendType.BEARISH
    return TrendType.UNDECISIVE
  }

  getAttributeValue(attributeType: AttributeType, indicatorCalcValue: number = null): number {
    switch (attributeType) {
      case AttributeType.OPEN:
        return this.open
      case AttributeType.CLOSE:
        return this.close
      case AttributeType.HIGH:
        return this.high
      case AttributeType.LOW:
        return this.low
      case AttributeType.SMA:
        return smaValue(indicatorCalcValue, this)
      case AttributeType.EMA:
        return emaValue(indicatorCalcValue, this)
      case AttributeType.RSI:
        return rsiValue(indicatorCalcValue, this)
      default:
        return 0
    }
  }

  /**
   * Takes 2 attributes values from 'rad' and a.) gives back value between those 2 attribute values based on percent or b.) gives only value of first attribute
   * For slice = new VerticalSlice(new Date(), 4, 14, 0, 0):
   *    - 9 for new RelativeAttributeData({ type1: AttributeType.OPEN, type2: AttributeType.CLOSE, percent: 0.5 })
   *    - 4 for new RelativeAttributeData({ type1: AttributeType.OPEN })
   * @param percent - values from -0.4 to 1.2 would mean -40% to 120%
   */
  getValueRelativeToAttributes(valueData: RelativeAttributeValueData): number {
    let ravSource: RelativeAttributeValueSource = valueData.getRelativeAttributeValueSource()
    if (ravSource === RelativeAttributeValueSource.TYPE1) {
      return this.getAttributeValue(valueData.type1)
    } else if (ravSource === RelativeAttributeValueSource.TYPE1_TYPE2) {
      let lowerAttributeValue = Math.min(
        this.getAttributeValue(valueData.type1),
        this.getAttributeValue(valueData.type2)
      )
      let attributesValueDistance = Math.abs(
        this.getAttributeValue(valueData.type1) - this.getAttributeValue(valueData.type2)
      )
      return lowerAttributeValue + attributesValueDistance * valueData.percent
    }
  }
}
