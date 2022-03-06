import { VerticalSlice } from "../stock/vertical-slice"
import { Direction } from "../types/direction"
import { Strategy } from "../strategy/strategy"
import { Stock } from "../stock/stock-data"

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
  constructor(stock: Stock, rewardToRisk: number) {
    this.stockName = stock.symbol
    this.interval = stock.interval
    this.rewardToRisk = rewardToRisk
  }

  stockName: string
  interval: string
  entryDatesOfProfitTrades: Date[] = []
  entryDatesOfLossTrades: Date[] = []
  rewardToRisk: number
  timesProfited: number = 0
  timesLost: number = 0
  timesIndecisive: number = 0
  winRate: number = 0
  plRatio: number = 0 //  plRatio=5, for each 1$ lost, 5$ are gained
  plFactor: number = 0 // plFactor is normalized version of plRatio, 0-0.5 for loss trades, 0.5-1 for profit trades. 0 -> -infinity, 1 --> +infinity

  /**
   * Loop through all slices starting from first
   * Checks if 'take profit' or 'stop loss' will be hit first
   * @slice0 - First vertical slice of a stock
   */
  doBacktest(slice0: VerticalSlice, strategy: Strategy) {
    // get enter slice, if enter slice has no next slice conected then there is not enough data to start backtest
    const enterSlice = slice0.getConnectedSlice(Direction.RIGHT, strategy.enterValueExRule.id)
    if (!enterSlice.next) return
    const enterVal = enterSlice.getValueRelativeToAttributes(strategy.enterValueExRule)
    // get stop loss value
    const stopLossSlice = slice0.getConnectedSlice(Direction.RIGHT, strategy.stopLossValueExRule.id)
    const stopLossVal = stopLossSlice.getValueRelativeToAttributes(strategy.stopLossValueExRule)
    // if enter and stop loss value are the same then there is no way to know is it profit or loss
    if (enterVal === stopLossVal) return
    // get take profit value
    const takeProfitVal = enterVal + Math.abs(enterVal - stopLossVal) * this.rewardToRisk
    // check if profit/loss value is hit for each slice on the right
    enterSlice.next.executeEachIteration(Direction.RIGHT, null, (slice) => {
      let result: TradeResult = this.getTradeResult(takeProfitVal, stopLossVal, slice.high, slice.low)
      if (result === TradeResult.PROFIT) {
        this.timesProfited += 1
        this.entryDatesOfProfitTrades.push(slice0.date)
      } else if (result === TradeResult.LOSS) {
        this.timesLost += 1
        this.entryDatesOfLossTrades.push(slice0.date)
      } else if (result === TradeResult.INDECISIVE) this.timesIndecisive += 1
      // If result value is profit, loss or indecisive then calculate win rate and stop further backtesting
      if (result !== TradeResult.NONE) {
        const profitsAndLoses = this.timesProfited + this.timesLost
        this.winRate = profitsAndLoses != 0 ? this.timesProfited / profitsAndLoses : 0
        this.updatePlRatio()
        this.getPlFactor()
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

  private updatePlRatio() {
    this.plRatio = this.winRate == 1 ? 9999 : (this.winRate * this.rewardToRisk) / (1 - this.winRate)
  }

  private getPlFactor() {
    this.plFactor = this.plRatio / (this.plRatio + 1)
  }

  print(): any {
    console.log({
      riskToReward: "1:" + this.rewardToRisk,
      winRate: this.winRate * 100 + "%",
      profitToRiskRatio: this.timesProfited * this.rewardToRisk - this.timesLost + "R",
      timesProfited: this.timesProfited,
      timesLost: this.timesLost,
      timesIndecisive: this.timesIndecisive,
    })
  }
}
