import { StockBacktest } from "./stock-backtest"

export class StrategyBacktest {
  constructor(strategyName: string) {
    this.strategyName = strategyName
  }

  strategyName: string
  stockbacktest: StockBacktest[] = []
}
