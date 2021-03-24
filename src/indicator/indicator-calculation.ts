import { VerticalSlice } from "../stock/vertical-slice"
import { Direction } from "../types/direction"

// Since ema calculation is including current price last one(period - 1) must be excluded
export function smaValue(smaPeriod: number, slice0: VerticalSlice): number {
  if (!slice0.hasConnectedPrices(Direction.LEFT, smaPeriod - 1) || smaPeriod <= 0) return null
  let sma: number = 0
  slice0.executeEachIteration(Direction.LEFT, smaPeriod - 1, (slice: VerticalSlice) => {
    sma += slice.close
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
export function emaValue(emaPeriod: number, slice: VerticalSlice): number {
  if (!slice.hasConnectedPrices(Direction.LEFT, emaPeriod * 2 - 4) || emaPeriod <= 0) return null
  const sma = smaValue(emaPeriod, slice.getConnectedPrice(Direction.LEFT, emaPeriod - 1))
  const multiplier = 2 / (emaPeriod + 1)
  const k = 2 / (emaPeriod + 1)
  let ema: number = 0
  for (var i = 1; i < emaPeriod; i++) {
    const prevEmaValue = i == 1 ? sma : ema
    const curSlice = slice.getConnectedPrice(Direction.LEFT, emaPeriod - 1 - i).close
    ema = (curSlice - prevEmaValue) * multiplier + prevEmaValue
    //console.log(`(${currentPrice} - ${prevEmaValue}) * ${multiplier} + ${prevEmaValue} = ` + ema)
  }
  return ema
}

// THIS SHIT NEEDS TO BE TESTED
export function rsiValue(rsiPeriod: number, slice: VerticalSlice): number {
  if (!slice.hasConnectedPrices(Direction.LEFT, rsiPeriod) || rsiPeriod <= 0) return null
  let gainSum = 0
  let lossSum = 0
  slice.executeEachIteration(Direction.LEFT, rsiPeriod - 1, (slice) => {
    const prevSlice = slice.getConnectedPrice(Direction.LEFT, 1)
    if (slice.close > prevSlice.close) gainSum += slice.close - prevSlice.close
    if (slice.close < prevSlice.close) lossSum += prevSlice.close - slice.close
    return true
  })
  const rs = gainSum / rsiPeriod / (lossSum / rsiPeriod)
  console.log(rs)
  return 100 - 100 / (1 + rs)
}
