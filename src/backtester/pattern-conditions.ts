import { PatternType } from "./pattern-type"
import { Price } from "../model/price/price"
import { smaValue } from "./indicator-calculation"
import { Direction } from "../model/price/direction"
import { IndicatorType } from "./types/indicator-type"
import { IndicatorList, Indicator } from "./indicator-list"
import { GraphEntityType } from "./types/graph-entity-type"

/**
 *
 * @param price
 * @param entityType
 * @param indicatorCalcValue => Value that indicator usses for calculation of value => 9 in EMA9, SMA9 or N value of previous prices in RSI
 */
export function getEntityValue(price: Price, entityType: GraphEntityType, indicatorCalcValue: number): number {
  switch (entityType) {
    case GraphEntityType.OPEN:
      return price.open
    case GraphEntityType.CLOSE:
      return price.close
    case GraphEntityType.HIGH:
      return price.high
    case GraphEntityType.LOW:
      return price.low
    case GraphEntityType.SMA:
      return smaValue(indicatorCalcValue, price)
    case GraphEntityType.EMA:
      return smaValue(indicatorCalcValue, price)
    case GraphEntityType.RSI:
      return smaValue(indicatorCalcValue, price)
    default:
      return 0
  }
}

/*
const patternTypeFuncMap = new Map<PatternType, (price: Price, indicators: IndicatorList) => boolean>()
patternTypeFuncMap.set(PatternType.BULL_ENG_BELOW_BELOW, (price: Price, indicators: IndicatorList): boolean => {
  // Calculate and validate SMA
  if (!indicators.exist(IndicatorType.SMA)) return false
  const smaPeriod: number = indicators.findFirst(IndicatorType.SMA)?.value
  const sma: number = smaValue(smaPeriod, price)
  if (sma == 0 || !price.hasConnectedPrices(Direction.LEFT, 1)) return false
  // Validate price action
  const isPriceEngulfingPrevious: boolean = price.close > price.prev.open
  const arePricesBelowSma: boolean = [price.open, price.close, price.prev.open, price.prev.close].every((p) => p < sma)
  // Validate other indicators
  return isPriceEngulfingPrevious && arePricesBelowSma
})
patternTypeFuncMap.set(PatternType.BULL_ENG_THROUGH_THROUGH, (price: Price): boolean => {
  console.log("BULL_ENG_THROUGH_THROUGH")
  return false
})

export function isPatternValid(pattern: PatternType, price: Price, indicators: IndicatorList): boolean {
  const isValid: boolean | undefined = patternTypeFuncMap.get(pattern)?.call(null, price, indicators)
  return !isValid ? false : isValid
}

let price: Price = new Price(new Date(), 0, 0, 0, 0)
console.log(isPatternValid(PatternType.BULL_ENG_BELOW_BELOW, price, new IndicatorList()))
*/
