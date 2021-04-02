import express, { json } from "express"
import { StockData } from "./stock/stock-data"
import { Direction } from "./types/direction"
import { BacktestResult } from "./backtest/backtest-result"
import { isPatternValid } from "./pattern-validator/pattern-validator"
import { Strategy } from "./strategy/strategy"
import { StrategyBacktestResults } from "./backtest/strategy-backtest-results"
import { ApiReceiver } from "./data-extractor/api-receiver"
import { JsonManager } from "./data-extractor/json-manager"

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
  console.log("/backtest called...")
  setHeaders(res)
  const strategy: Strategy = Strategy.copy(req.body)
  console.log(strategy.description())
  let strategyBacktestResults = new StrategyBacktestResults(strategy.name, [])
  const fs = require("fs")
  const stocksPath = `src/resources/json/stocks`

  const intervals: string[] = fs.readdirSync(stocksPath).map((file: string) => file)
  for (const interval of intervals) {
    let stocks: StockData[] = []
    const fileNames: string[] = fs.readdirSync(`${stocksPath}/${interval}`).map((file: string) => file)
    for (const fileName of fileNames) {
      const jsonData = fs.readFileSync(`${stocksPath}/${interval}/${fileName}`, {
        encoding: "utf8",
        flag: "r",
      })
      stocks = StockData.getParsedJsonData(jsonData)

      // For stock read from current json file
      for (const stock of stocks) {
        let backtestData = new BacktestResult(stock.symbol, 6)
        stock.first().executeEachIteration(Direction.RIGHT, stock.length() - 1, (slice) => {
          // Execute backtest if pattern is valid for given slice
          if (isPatternValid(slice, strategy.rules)) backtestData.doBacktest(slice, strategy)
          return true
        })
        strategyBacktestResults.backtestResults.push(backtestData)
      }
    }
  }
  res.send(JSON.stringify(strategyBacktestResults))
  console.log("/backtest ended...")
})
