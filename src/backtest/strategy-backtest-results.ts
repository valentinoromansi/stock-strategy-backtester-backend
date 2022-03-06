import { BacktestResult } from "./backtest-result"

export class StrategyReport {
  constructor(strategyName: string, backtestResults: BacktestResult[]) {
    this.strategyName = strategyName
    this.backtestResults = backtestResults
  }

  strategyName: string
  backtestResults: BacktestResult[] = []
}
