import { VerticalSlice } from "../stock/vertical-slice"
import { Direction } from "../types/direction"
import { Strategy } from "../strategy/strategy"

enum TradeResult {
  PROFIT,
  LOSS,
  INDECISIVE,
  NONE,
}

/**
 * BacktestData object tests 1 stock against 1 strategy and generates backtest data
 */
export class BacktestResult {
  constructor(stockName: string, riskToReward: number) {
    this.stockName = stockName
    this.riskToReward = riskToReward
  }

  stockName: string
  riskToReward: number
  timesProfited: number = 0
  timesLost: number = 0
  timesIndecisive: number = 0
  winRate: number = 0

  /**
   * Checks will 'take profit' or 'stop loss' be hit first
   */
  doBacktest(slice0: VerticalSlice, strategy: Strategy) {
    // get enter value, if enter slice has no next slice conected then there is not enough data to start backtest
    const enterSlice = slice0.getConnectedPrice(Direction.RIGHT, strategy.enterRad.id)
    if (!enterSlice.next) return
    const enter = enterSlice.getValueRelativeToAttributes(strategy.enterRad)
    // get stop loss value
    const stopLossSlice = slice0.getConnectedPrice(Direction.RIGHT, strategy.stopLossRad.id)
    const stopLoss = stopLossSlice.getValueRelativeToAttributes(strategy.stopLossRad)
    // if enter and stop loss value are the same then there is no way to know is it profit or loss
    if (enter === stopLoss) return
    // get take profit value
    const takeProfit = enter + Math.abs(enter - stopLoss) * this.riskToReward
    // check if profit/loss value is hit for each slice on the right
    enterSlice.next.executeEachIteration(Direction.RIGHT, null, (slice) => {
      let result: TradeResult = this.getTradeResult(takeProfit, stopLoss, slice.high, slice.low)
      if (result === TradeResult.PROFIT) this.timesProfited += 1
      else if (result === TradeResult.LOSS) this.timesLost += 1
      else if (result === TradeResult.INDECISIVE) this.timesIndecisive += 1
      // If result value is profit, loss or indecisive then calculate win rate and stop further backtesting
      if (result !== TradeResult.NONE) {
        const profitsAndLoses = this.timesProfited + this.timesLost
        this.winRate = profitsAndLoses != 0 ? this.timesProfited / profitsAndLoses : 0
        return false
      }
      // If there is no next slice return failed backtest
      if (!slice.next) {
        return false
      }
      return true
    })
  }

  private getTradeResult(takeProfit: number, stopLoss: number, high: number, low: number): TradeResult {
    if (high > takeProfit && low < stopLoss) return TradeResult.INDECISIVE
    else if (high > takeProfit) return TradeResult.PROFIT
    else if (low < stopLoss) return TradeResult.LOSS
    return TradeResult.NONE
  }

  print(): any {
    console.log({
      riskToReward: "1:" + this.riskToReward,
      winRate: this.winRate * 100 + "%",
      profitToRiskRatio: this.timesProfited * this.riskToReward - this.timesLost + "R",
      timesProfited: this.timesProfited,
      timesLost: this.timesLost,
      timesIndecisive: this.timesIndecisive,
    })
  }
}
