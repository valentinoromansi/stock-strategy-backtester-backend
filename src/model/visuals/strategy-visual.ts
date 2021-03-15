import { VerticalSlice } from "../price/vertical-slice"

export class StrategyVisual {
  constructor(init?: Partial<any>) {
    Object.assign(this, init)
  }
  price: VerticalSlice
  ema: number
  rsi: number
  volume: number
}
