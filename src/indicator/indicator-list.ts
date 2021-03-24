import { Position } from "../types/position"
import { IndicatorType } from "../types/indicator-type"

// value -> PERIOD for moving average for EMA and SMA, VALUE for RSI
export type Indicator = { type: IndicatorType; value: number; priceToindicatorPosition: Position }

export class IndicatorList {
  indicators: Indicator[]

  findFirst(targetIndiType: IndicatorType): Indicator | any {
    this.indicators.forEach((indicator) => {
      if (indicator.type == targetIndiType) return indicator
    })
    return null
  }

  exist(targetIndiType: IndicatorType): boolean {
    this.indicators.forEach((indicator) => {
      if (indicator.type == targetIndiType) return true
    })
    return false
  }
}
