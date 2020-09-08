import { Price } from "../model/price/price"
import { Direction } from "../model/price/direction"

// Since ema calculation is including current price last one(period - 1) must be excluded
export function smaValue(smaPeriod: number, price: Price): number {
  if (!price.hasConnectedPrices(Direction.LEFT, smaPeriod - 1) || smaPeriod <= 0) return 0
  let sma: number = 0
  price.executeEachIteration(Direction.LEFT, smaPeriod - 1, (price: Price) => {
    sma += price.close
  })
  return sma / smaPeriod
}
