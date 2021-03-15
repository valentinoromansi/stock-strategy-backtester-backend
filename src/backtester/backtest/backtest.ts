import { VerticalSlice } from "../../model/price/vertical-slice"
import { Direction } from "../../model/price/direction"

export class BacktestData {
  constructor(riskToReward: number) {
    this.riskToReward = riskToReward
  }
  riskToReward: number
  won: number = 0
  lost: number = 0
  finalRiskReward: number = 0

  /**
   * This is used to backtest given price, NOT LIST OF PRICES
   * CHANGE THIS SO IT CAN BE DEFINED AND SENT TO BACK FROM FRONT SAME AS STRATEGY IS!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
   */
  doBacktest(price: VerticalSlice) {
    const stopLoss = price.low
    const enter = price.close
    const takeProfit = enter + Math.abs(enter - stopLoss) * this.riskToReward
    price.executeEachIteration(Direction.RIGHT, null, (price) => {
      if (price.close > takeProfit || price.high > takeProfit) return (this.won += 1)
      if (price.open < stopLoss || price.low < stopLoss) return (this.lost += 1)
    })
    this.riskToReward = this.won - this.lost
  }
}

/**
 * CHANGE THIS SO IT CAN BE DEFINED AND SENT TO BACK FROM FRONT SAME AS STRATEGY IS!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
 */
