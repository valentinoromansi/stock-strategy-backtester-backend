import { VerticalSlice } from "../../model/price/vertical-slice"
import { Direction } from "../../model/price/direction"
import { GraphEntity } from "../model/graph-entity"
import { Strategy } from "../model/strategy"

enum TradeResult {
  PROFIT,
  LOSS,
  INDECISIVE,
  NONE
}

export class BacktestData {
  constructor(riskToReward: number) {
    this.riskToReward = riskToReward
  }
  riskToReward: number
  timesProfited: number = 0
  timesLost: number = 0
  timesIndecisive: number = 0
  winRate: number = 0

  doBacktest(slice0: VerticalSlice, strategy: Strategy): boolean {
    // get enter value
    const enterSlice = slice0.getConnectedPrice(Direction.RIGHT, strategy.enterEntity.id)
    if (!enterSlice.next)
      return false
    const enter = strategy.enterEntity.getValueRelativeToAttributes(enterSlice)
    // get stop loss value
    const stopLossSlice = slice0.getConnectedPrice(Direction.RIGHT, strategy.stopLossEntity.id)
    const stopLoss = strategy.stopLossEntity.getValueRelativeToAttributes(stopLossSlice)
    // get take profit value
    console.log(enter, stopLoss)
    if(enter - stopLoss == 0)
      return false
    const takeProfit = enter + Math.abs(enter - stopLoss) * this.riskToReward
    // check if profit/loss value is hit for each next candle
    let backtestSuccess: boolean = false
    enterSlice.next.executeEachIteration(Direction.RIGHT, null, (slice) => {
      let result: TradeResult = this.getTradeResult(takeProfit, stopLoss, slice.high, slice.low)
      if (result === TradeResult.PROFIT)
        this.timesProfited += 1
      else if (result === TradeResult.LOSS)
        this.timesLost += 1
      else if (result === TradeResult.INDECISIVE)
        this.timesIndecisive += 1
      // If result value is profit, loss or indecisive then calculate win rate and stop further backtesting
      if (result !== TradeResult.NONE) {
        const profitsAndLoses = this.timesProfited + this.timesLost
        this.winRate = (profitsAndLoses != 0) ? this.timesProfited / profitsAndLoses : 0
        backtestSuccess = true
        return false
      }
      // If there is no next slice return failed backtest
      if (!slice.next) {
        backtestSuccess = false
        return false
      }
      return true
    })
    return backtestSuccess
  }


  getTradeResult(takeProfit: number, stopLoss: number, high: number, low: number): TradeResult {
    console.log(takeProfit, stopLoss, high, low)
    if (high > takeProfit && low < stopLoss) 
      return TradeResult.INDECISIVE
    else if (high > takeProfit) 
      return TradeResult.PROFIT
    else if (low < stopLoss) 
      return TradeResult.LOSS
    return TradeResult.NONE
  }


  print(): any {
    console.log({
      testSample: this.timesProfited + this.timesLost,
      riskToReward: '1:' + this.riskToReward,
      winRate: this.winRate * 100 + '%',
      profitToRiskRatio: (this.timesProfited * this.riskToReward) - this.timesLost + 'R',
      timesProfited: this.timesProfited,
      timesLost: this.timesLost,
      timesIndecisive: this.timesIndecisive
    })
  }

}
