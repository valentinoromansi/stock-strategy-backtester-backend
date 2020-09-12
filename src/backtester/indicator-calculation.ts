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

/* EMA: {Close - EMA(previous day)} x multiplier + EMA(previous day)
 * For EMA10 prices from previous 20 days are needed
 * 1.) Prices from previous 10 days are needed to accurately calculate todays EMA value
 * 2.) Price 9 days in the past will calculate it's EMA using SMA of previous day. FOr that SMA there need to exist 10 prices before it
 * Prices on days => [1 ,2, 3, 4, 5 ,6 , 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
 * 1 to 10 are for calculating SMA10 for day 10, 11 to 20 are to accurately calculate EMA10 for day 20
 */
export function emaValue(emaPeriod: number, price: Price): number {
  if (!price.hasConnectedPrices(Direction.LEFT, emaPeriod * 2 - 1) || emaPeriod <= 0) return 0
  const sma = smaValue(emaPeriod, price.getConnectedPrice(Direction.LEFT, emaPeriod - 1)) // (1),2,3,4,5,6,7,8,9, 10 => 1 will be initial price
  const multiplier = 2 / (emaPeriod + 1)
  let ema: number = 0
  console.log(sma)
  for (let i = 0; i < emaPeriod; ++i) {
    const emaPrice = price.getConnectedPrice(Direction.LEFT, emaPeriod - 1)
    const prevEma = i == 0 ? sma : ema
    ema = (emaPrice.close - prevEma) * multiplier + prevEma
    console.log(ema)
  }
  return ema
}

// Since ema calculation is including current price last one(period - 1) must be excluded
export function rsiValue(smaPeriod: number, price: Price): number {
  return 0
}
