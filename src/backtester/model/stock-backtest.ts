export class StockBacktest {
  constructor(stockName: string, riskToReward: number) {
    this.stockName = stockName
    this.riskToReward = riskToReward
  }

  stockName: string
  riskToReward: number
  won: number = 0
  lost: number = 0
  indecisive: number = 0
  finalRiskReward: number = 0
}
