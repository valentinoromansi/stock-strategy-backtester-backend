import express, { json } from "express"
import { Stock } from "./stock/stock-data"
import { Direction } from "./types/direction"
import { BacktestResult } from "./backtest/backtest-result"
import { isPatternValid } from "./pattern-validator/pattern-validator"
import { Strategy } from "./strategy/strategy"
import { StrategyBacktestResults } from "./backtest/strategy-backtest-results"
import { ApiReceiver } from "./data-extractor/api-receiver"
import { JsonManager } from "./data-extractor/json-manager"

const colors = require("colors")

function setHeaders(res: any) {
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE")
  res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,Content-Type")
  res.setHeader("Access-Control-Allow-Credentials", true)
  res.setHeader("Content-Type", "application/json")
}

export const app = express()
app.use(express.json())
// Cors is used for this reason: https://dev.to/p0oker/why-is-my-browser-sending-an-options-http-request-instead-of-post-5621
var cors = require("cors")
app.use(cors())

const apiReceiver: ApiReceiver = new ApiReceiver()

// Get price data
// ? Rename it to fetch-stock-data
app.get("/update-stock-data", async (req: any, res: any) => {
  console.log("/update-stock-data called...")
  setHeaders(res)
  const status: boolean = await apiReceiver.fetchStockData()
  res.send(status, null, 2)
  console.log(colors.green(`/update-stock-data ended...`))
})

// Do backtest
app.post("/backtest", async (req, res) => {
  console.log("/backtest called...")
  setHeaders(res)
  console.log("Request: ", req.body)
  const strategy: Strategy = Strategy.copy(req.body)
  console.log(strategy.description())
  let strategyBacktestResults = new StrategyBacktestResults(strategy.name, [])
  const fs = require("fs")
  const stocksPath = `src/resources/stocks`

  const intervals: string[] = fs.readdirSync(stocksPath).map((file: string) => file)
  for (const interval of intervals) {
    let stocks: Stock[] = []
    const fileNames: string[] = fs.readdirSync(`${stocksPath}/${interval}`).map((file: string) => file)
    for (const fileName of fileNames) {
      const json = fs.readFileSync(`${stocksPath}/${interval}/${fileName}`, {
        encoding: "utf8",
        flag: "r",
      })
      stocks = Stock.fromJson(json)

      // For stock read from current json file
      for (const stock of stocks) {
        // If stock data is not valid skip it
        const isValid: boolean = stock.symbol && stock.symbol && stock.slices && stock.slices?.length > 0
        if (!isValid) continue
        // Do backtest for valid stock data for every risk to reward value
        for (const rewardToRisk of strategy.riskToRewardList) {
          let backtestData = new BacktestResult(stock, rewardToRisk)
          stock.first().executeEachIteration(Direction.RIGHT, stock.length() - 1, (slice) => {
            // Execute backtest if pattern is valid for given slice
            if (isPatternValid(slice, strategy.strategyConRules)) backtestData.doBacktest(slice, strategy)
            return true
          })
          strategyBacktestResults.backtestResults.push(backtestData)
        }
      }
    }
  }
  res.send(JSON.stringify(strategyBacktestResults))
  console.log(colors.green(`/backtest ended...`))
})
