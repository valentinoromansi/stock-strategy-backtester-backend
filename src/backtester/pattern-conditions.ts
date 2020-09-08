import { Pattern } from "./pattern-type"
import { Price } from "../model/price/price"
import { smaValue } from "./indicator-calculation"
import { Direction } from "../model/price/direction"

const patternTypeFuncMap = new Map<Pattern, (price: Price) => boolean>()
patternTypeFuncMap.set(Pattern.BULL_ENG_BELOW_BELOW, (price: Price): boolean => {
  const sma: number = smaValue(3, price)
  if (sma == 0 || !price.hasConnectedPrices(Direction.LEFT, 1)) return false
  const isPriceEngulfingPrevious: boolean = price.close > price.prev.open
  const arePricesBelowSma: boolean = [price.open, price.close, price.prev.open, price.prev.close].every((p) => p < sma)
  return isPriceEngulfingPrevious && arePricesBelowSma
})
patternTypeFuncMap.set(Pattern.BULL_ENG_THROUGH_THROUGH, (price: Price): boolean => {
  console.log("BULL_ENG_THROUGH_THROUGH")
  return false
})

export function isPatternValid(pattern: Pattern, price: Price): boolean {
  const isValid: boolean | undefined = patternTypeFuncMap.get(pattern)?.call(null, price)
  return !isValid ? false : isValid
}

let price: Price = new Price(new Date(), 0, 0, 0, 0)
console.log(isPatternValid(Pattern.BULL_ENG_BELOW_BELOW, price))
