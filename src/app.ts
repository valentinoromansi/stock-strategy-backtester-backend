import express from "express"
import { StockData } from "./stock/stock-data"
import { Direction } from "./types/direction"
import { BacktestResult } from "./backtest/backtest-result"
import { isPatternValid } from "./pattern-validator/pattern-validator"
import { Strategy } from "./strategy/strategy"
import { StrategyBacktestResults } from "./backtest/strategy-backtest-results"
import { ApiReceiver } from "./data-extractor/api-receiver"

function setHeaders(res: any) {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000")
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE")
  res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type")
  res.setHeader("Access-Control-Allow-Credentials", true)
  res.setHeader("Content-Type", "application/json")
}

export const app = express()
app.use(express.json())

const apiReceiver: ApiReceiver = new ApiReceiver()

// Get price data
app.get("/update-stock-data", async (req: any, res: any) => {
  console.log("/update-stock-data called...")
  setHeaders(res)
  const status: boolean = await apiReceiver.updateStockData()
  res.send(status, null, 2)
  console.log("/update-stock-data ended...")
})

// Do backtest
app.get("/backtest", async (req, res) => {
  /*
  console.log("/backtest called...")
  setHeaders(res)

  const strategy: Strategy = Strategy.copy(req.body)
  let stocksData: StockData[] = await apiReceiver.updateStockData()

  let strategyBacktestResults = new StrategyBacktestResults(strategy.name, [])

  stocksData.forEach((stock) => {
    let backtestData = new BacktestResult(stock.symbol, 1)
    stock.first().executeEachIteration(Direction.RIGHT, stock.length() - 1, (slice) => {
      // Test if pattern is valid for given slice
      if (isPatternValid(slice, strategy.rules)) {
        backtestData.doBacktest(slice, strategy)
      }
      return true
    })
    strategyBacktestResults.backtestResults.push(backtestData)
  })

  console.log(strategy.description())

  res.send(JSON.stringify(strategyBacktestResults))
  console.log("/backtest ended...")
*/
})
