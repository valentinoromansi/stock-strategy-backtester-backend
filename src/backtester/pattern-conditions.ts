import { Price } from "../model/price/price"
import { smaValue, emaValue, rsiValue } from "./indicator-calculation"
import { Direction } from "../model/price/direction"
import { IndicatorType } from "./types/indicator-type"
import { IndicatorList, Indicator } from "./indicator-list"
import { GraphEntityType } from "./types/graph-entity-type"
import { StrategyRule } from "./model/strategy-rule"
import { GraphPositionType } from "./types/graph-position-type"
import { GraphEntity } from "./model/graph-entity"

/**
 *
 * @param price
 * @param entityType
 * @param indicatorCalcValue => Value that indicator usses for calculation of value => 9 in EMA9, SMA9 or N value of previous prices in RSI
 */
export function getEntityValue(price: Price, entityType: GraphEntityType, indicatorCalcValue: number = null): number {
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
      return emaValue(indicatorCalcValue, price)
    case GraphEntityType.RSI:
      return rsiValue(indicatorCalcValue, price)
    default:
      return 0
  }
}

function isTypePrice(entityType: GraphEntityType) {
  return [GraphEntityType.OPEN, GraphEntityType.CLOSE, GraphEntityType.HIGH, GraphEntityType.LOW].includes(entityType)
}

function getComparisonValue(price: Price, entity: GraphEntity): number {
  // if it's price value
  if (isTypePrice(entity.type)) {
    const priceForEntity = price.getConnectedPrice(Direction.RIGHT, entity.id)
    return getEntityValue(priceForEntity, entity.type)
  }
  // if it's indicator value
  else {
    const priceForEntity = price.getConnectedPrice(Direction.RIGHT, entity.id)
    return getEntityValue(priceForEntity, entity.type, entity.period)
  }
}

// Used only for when entityType1 is OPEN, CLOSE, HIGH, LOW
export function areValuesWithinRangeEqual(price: Price, rule: StrategyRule): boolean {
  const price1 = price.getConnectedPrice(Direction.RIGHT, rule.graphEntity1.id)
  if (!isTypePrice(rule.graphEntity1.type) && price1 && price1 != price) return false
  // Get offset
  let offset = 0
  const tryCalculateOffset = (enToEnGraphTypes: GraphEntityType[], enToEnHeight: number) => {
    offset = enToEnGraphTypes.includes(rule.graphEntity1.type) ? enToEnHeight * (rule.offsetPercentage / 100) : offset
  }
  tryCalculateOffset([GraphEntityType.OPEN, GraphEntityType.CLOSE], Math.abs(price1.open - price1.close))
  tryCalculateOffset([GraphEntityType.HIGH], price1.high - (price1.close > price1.open ? price1.close : price1.open))
  tryCalculateOffset([GraphEntityType.LOW], (price1.close < price1.open ? price1.close : price1.open) - price1.low)

  const val1 = getComparisonValue(price, rule.graphEntity1)
  const val2 = getComparisonValue(price, rule.graphEntity2)
  return val2 >= val1 - offset && val2 <= val1 + offset
}

export function isPatternValid(price: Price, strategyRules: StrategyRule[]): boolean {
  const biggestId = Math.max(...strategyRules.map((rule) => Math.max(rule.graphEntity1.id, rule.graphEntity2.id)))
  if (!price.hasConnectedPrices(Direction.RIGHT, biggestId)) return false

  let priceEnums = [GraphEntityType.OPEN, GraphEntityType.CLOSE, GraphEntityType.HIGH, GraphEntityType.LOW]
  strategyRules.forEach((rule) => {
    const val1 = getComparisonValue(price, rule.graphEntity1)
    const val2 = getComparisonValue(price, rule.graphEntity2)
    // check if rule is valid
    if (rule.position == GraphPositionType.ABOVE && val1 > val2) return true
    if (rule.position == GraphPositionType.BELOW && val1 < val2) return true
    if (rule.position == GraphPositionType.EQUAL && areValuesWithinRangeEqual(price, rule)) return true
  })
  return false
}
