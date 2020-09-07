import { Price } from "../price/price"

export class StrategyVisual {
  constructor(init?: Partial<any>) {
    Object.assign(this, init)
  }
  price: Price
  ema: number
  rsi: number
  volume: number
}
