import { StockData } from "../../src/model/price/stock-data"
import { VerticalSlice } from "../../src/model/price/vertical-slice"
import { smaValue } from "../../src/backtester/indicator-calculation"
import { StrategyRule } from "../../src/backtester/model/strategy-rule"
import { GraphEntity } from "../../src/backtester/model/graph-entity"
import { GraphEntityType } from "../../src/backtester/types/graph-entity-type"
import { GraphPositionType } from "../../src/backtester/types/graph-position-type"
import { areValuesWithinRangeEqual } from "../../src/backtester/pattern-conditions"

/***********************
 * BULL_ENG_BELOW_BELOW
 ***********************/

test("blabla", () => {})

/*
test("isPatternValid must be true for valid engulfing pattern and price under sma", () => {
  let prices: PriceLinkedList = new PriceLinkedList()
  prices.append(new Price(new Date(), 0, 50, 0, 0))
  prices.append(new Price(new Date(), 1, 0.5, 0, 0))
  prices.append(new Price(new Date(), 0.5, 1.1, 0, 0))

  const isValid = isPatternValid(Pattern.BULL_ENG_BELOW_BELOW, prices.last)
  expect(isValid).toBe(true)
})

test("isPatternValid must be false for invalid engulfing pattern -> not engulfing", () => {
  let prices: PriceLinkedList = new PriceLinkedList()
  prices.append(new Price(new Date(), 0, 50, 0, 0))
  prices.append(new Price(new Date(), 1, 0.5, 0, 0))
  prices.append(new Price(new Date(), 0.5, 0.9, 0, 0))

  const isValid = isPatternValid(Pattern.BULL_ENG_BELOW_BELOW, prices.last)
  expect(isValid).toBe(false)
})

test("isPatternValid must be false for invalid engulfing pattern -> not under sma", () => {
  let prices: PriceLinkedList = new PriceLinkedList()
  prices.append(new Price(new Date(), 0, 50, 0, 0))
  prices.append(new Price(new Date(), 50, 49, 0, 0))
  prices.append(new Price(new Date(), 49, 100, 0, 0))

  const isValid = isPatternValid(Pattern.BULL_ENG_BELOW_BELOW, prices.last)
  expect(isValid).toBe(false)
})
*/

/*
 * {
	"entity1":
		"id": "0"
    "type": "LOW",
    "period": "null"
	"position": "EQUAL",
	"positionOffset": 10 // used as percentage
	"entity2":
		"id": "1"
    "type": "LOW",
    "period": "null"
}

graphEntity1: GraphEntity
  position: GraphPositionType
  positionOffset: number
  graphEntity2: GraphEntity
*/
test("areValuesWithOffsetEqual for GraphEntityType.LOW", () => {
  const prices: StockData = new StockData()
  const price1 = prices.append(new VerticalSlice(new Date(), 12, 11, 0, 9))
  const price2 = prices.append(new VerticalSlice(new Date(), 0, 0, 0, 0))
  const rule = new StrategyRule({
    graphEntity1: new GraphEntity({
      id: 0,
      type: GraphEntityType.LOW,
      period: null,
    }),
    position: GraphPositionType.EQUAL,
    offsetPercentage: 10,
    graphEntity2: new GraphEntity({
      id: 1,
      type: GraphEntityType.LOW,
      period: null,
    }),
  })

  price2.low = 8.8
  expect(areValuesWithinRangeEqual(price1, rule)).toBe(true)
  price2.low = 8.79
  expect(areValuesWithinRangeEqual(price1, rule)).toBe(false)
  price2.low = 8.81
  expect(areValuesWithinRangeEqual(price1, rule)).toBe(true)
  price2.low = 9.19
  expect(areValuesWithinRangeEqual(price1, rule)).toBe(true)
  price2.low = 9.2
  expect(areValuesWithinRangeEqual(price1, rule)).toBe(true)
  price2.low = 9.21
  expect(areValuesWithinRangeEqual(price1, rule)).toBe(false)
})

test("areValuesWithOffsetEqual for GraphEntityType.HIGH", () => {
  const prices: StockData = new StockData()
  const price1 = prices.append(new VerticalSlice(new Date(), 12, 11, 14, 0))
  const price2 = prices.append(new VerticalSlice(new Date(), 0, 0, 0, 0))
  const rule = new StrategyRule({
    graphEntity1: new GraphEntity({
      id: 0,
      type: GraphEntityType.HIGH,
      period: null,
    }),
    position: GraphPositionType.EQUAL,
    offsetPercentage: 10,
    graphEntity2: new GraphEntity({
      id: 1,
      type: GraphEntityType.HIGH,
      period: null,
    }),
  })

  price2.high = 13.79
  expect(areValuesWithinRangeEqual(price1, rule)).toBe(false)
  price2.high = 13.8
  expect(areValuesWithinRangeEqual(price1, rule)).toBe(true)
  price2.high = 13.81
  expect(areValuesWithinRangeEqual(price1, rule)).toBe(true)
  price2.high = 14.19
  expect(areValuesWithinRangeEqual(price1, rule)).toBe(true)
  price2.high = 14.2
  expect(areValuesWithinRangeEqual(price1, rule)).toBe(true)
  price2.high = 14.21
  expect(areValuesWithinRangeEqual(price1, rule)).toBe(false)
})

test("areValuesWithOffsetEqual for GraphEntityType.OPEN", () => {
  const prices: StockData = new StockData()
  const price1 = prices.append(new VerticalSlice(new Date(), 10, 11, 0, 0))
  const price2 = prices.append(new VerticalSlice(new Date(), 0, 0, 0, 0))
  const rule = new StrategyRule({
    graphEntity1: new GraphEntity({
      id: 0,
      type: GraphEntityType.OPEN,
      period: null,
    }),
    position: GraphPositionType.EQUAL,
    offsetPercentage: 10,
    graphEntity2: new GraphEntity({
      id: 1,
      type: GraphEntityType.OPEN,
      period: null,
    }),
  })

  price2.open = 9.89
  expect(areValuesWithinRangeEqual(price1, rule)).toBe(false)
  price2.open = 9.9
  expect(areValuesWithinRangeEqual(price1, rule)).toBe(true)
  price2.open = 9.91
  expect(areValuesWithinRangeEqual(price1, rule)).toBe(true)
  price2.open = 10.09
  expect(areValuesWithinRangeEqual(price1, rule)).toBe(true)
  price2.open = 10.1
  expect(areValuesWithinRangeEqual(price1, rule)).toBe(true)
  price2.open = 10.11
  expect(areValuesWithinRangeEqual(price1, rule)).toBe(false)
})

test("areValuesWithOffsetEqual for GraphEntityType.CLOSE", () => {
  const prices: StockData = new StockData()
  const price1 = prices.append(new VerticalSlice(new Date(), 10, 11, 0, 0))
  const price2 = prices.append(new VerticalSlice(new Date(), 0, 0, 0, 0))
  const rule = new StrategyRule({
    graphEntity1: new GraphEntity({
      id: 0,
      type: GraphEntityType.CLOSE,
      period: null,
    }),
    position: GraphPositionType.EQUAL,
    offsetPercentage: 10,
    graphEntity2: new GraphEntity({
      id: 1,
      type: GraphEntityType.CLOSE,
      period: null,
    }),
  })

  price2.close = 10.89
  expect(areValuesWithinRangeEqual(price1, rule)).toBe(false)
  price2.close = 10.9
  expect(areValuesWithinRangeEqual(price1, rule)).toBe(true)
  price2.close = 10.91
  expect(areValuesWithinRangeEqual(price1, rule)).toBe(true)
  price2.close = 11.09
  expect(areValuesWithinRangeEqual(price1, rule)).toBe(true)
  price2.close = 11.1
  expect(areValuesWithinRangeEqual(price1, rule)).toBe(true)
  price2.close = 11.11
  expect(areValuesWithinRangeEqual(price1, rule)).toBe(false)
})
