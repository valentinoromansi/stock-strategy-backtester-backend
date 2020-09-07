import { Price } from "../model/price/price"
import { Direction } from "../model/price/direction"

// Since ema calculation is including current price last one(period - 1) must be excluded
export function emaValue(emaPeriod: number, price: Price): number {
  if (!price.hasConnectedPrices(Direction.LEFT, emaPeriod - 1) || emaPeriod <= 0) return 0
  let ema: number = 0
  price.executeEachIteration(Direction.LEFT, emaPeriod - 1, (price: Price) => {
    ema += price.close
  })
  return ema / emaPeriod
}
