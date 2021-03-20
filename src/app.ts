import { ExcelExtractor } from "./data-extractor/excel-extractor"
import IExtractor from "./data-extractor/extractor-i"
import express from "express"
import { StockData } from "./stock/stock-data"
import { Direction } from "./types/direction"
import { BacktestResult } from "./backtest/backtest-result"
import { isPatternValid } from "./pattern-validator/pattern-validator"
import { Strategy } from "./strategy/strategy"
import { StrategyBacktestResults } from "./backtest/strategy-backtest-results"
import { Position } from "./types/position"

function setHeaders(res: any) {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000")
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE")
  res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type")
  res.setHeader("Access-Control-Allow-Credentials", true)
  res.setHeader("Content-Type", "application/json")
}

export const app = express()
app.use(express.json())

const priceExtractor: IExtractor = new ExcelExtractor()

// Get price data
app.get("/stock-data", async (req: any, res: any) => {
  console.log('/stock-data called...')
  setHeaders(res)
  let stockData: StockData[] = await priceExtractor.readPriceData(false)
  let jsonNullReplacer = (key: string, value: any) => {
    if (value !== null) return value
  }  
  let responseJson: string = JSON.stringify(stockData, jsonNullReplacer, 2)
  res.send(responseJson, null, 2)
  console.log('/stock-data ended...')
})

// Do backtest
app.get("/backtest", async (req, res) => {
  console.log('/backtest called...')
  setHeaders(res)

  const strategy: Strategy = Strategy.copy(req.body)
  let stocksData: StockData[] = await priceExtractor.readPriceData(true)
  
  let strategyBacktestResults = new StrategyBacktestResults(strategy.name, [])

  stocksData.forEach(stock => {
    let backtestData = new BacktestResult(stock.name, 1)
    stock.first().executeEachIteration(Direction.RIGHT, stock.length() - 1, (slice) => {
      // Test if pattern is valid for given slice
      if (isPatternValid(slice, strategy.rules)) {      
        backtestData.doBacktest(slice, strategy)
      }
      return true
    })
    strategyBacktestResults.backtestResults.push(backtestData)
  });

  console.log(strategy.description())

  res.send(JSON.stringify(strategyBacktestResults))
  console.log('/backtest ended...')
})
