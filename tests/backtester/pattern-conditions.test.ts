import { PriceLinkedList } from "../../src/model/price/price-linked-list"
import { Price } from "../../src/model/price/price"
import { smaValue } from "../../src/backtester/indicator-calculation"

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
