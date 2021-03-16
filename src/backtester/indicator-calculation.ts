import { VerticalSlice } from "../model/price/vertical-slice"
import { Direction } from "../model/price/direction"

// Since ema calculation is including current price last one(period - 1) must be excluded
export function smaValue(smaPeriod: number, price: VerticalSlice): number {
  if (!price.hasConnectedPrices(Direction.LEFT, smaPeriod - 1) || smaPeriod <= 0) return null
  let sma: number = 0
  price.executeEachIteration(Direction.LEFT, smaPeriod - 1, (price: VerticalSlice) => {
    sma += price.close
    return true
  })
  return sma / smaPeriod
}

/* EMA: {Close - EMA(previous day)} x multiplier + EMA(previous day)
 * For EMAX, X*2-1 prices are needed
 * 1th to (x - 1)th prices are used to calculate SMA for (x - 1)th price
 * Xth to (x + 2)th prices are used to calculate EMA
 * For EMA4, prices from previous 7 days are needed
 */
export function emaValue(emaPeriod: number, price: VerticalSlice): number {
  if (!price.hasConnectedPrices(Direction.LEFT, emaPeriod * 2 - 4) || emaPeriod <= 0) return null
  const sma = smaValue(emaPeriod, price.getConnectedPrice(Direction.LEFT, emaPeriod - 1))
  const multiplier = 2 / (emaPeriod + 1)
  const k = 2 / (emaPeriod + 1)
  let ema: number = 0
  for (var i = 1; i < emaPeriod; i++) {
    const prevEmaValue = i == 1 ? sma : ema
    const currentPrice = price.getConnectedPrice(Direction.LEFT, emaPeriod - 1 - i).close
    ema = (currentPrice - prevEmaValue) * multiplier + prevEmaValue
    //console.log(`(${currentPrice} - ${prevEmaValue}) * ${multiplier} + ${prevEmaValue} = ` + ema)
  }
  return ema
}

// THIS SHIT NEEDS TO BE TESTED
export function rsiValue(rsiPeriod: number, price: VerticalSlice): number {
  if (!price.hasConnectedPrices(Direction.LEFT, rsiPeriod) || rsiPeriod <= 0) return null
  let gainSum = 0
  let lossSum = 0
  price.executeEachIteration(Direction.LEFT, rsiPeriod - 1, (price) => {
    const prevPrice = price.getConnectedPrice(Direction.LEFT, 1)
    if (price.close > prevPrice.close) gainSum += price.close - prevPrice.close
    if (price.close < prevPrice.close) lossSum += prevPrice.close - price.close
    return true
  })
  const rs = gainSum / rsiPeriod / (lossSum / rsiPeriod)
  console.log(rs)
  return 100 - 100 / (1 + rs)
}
