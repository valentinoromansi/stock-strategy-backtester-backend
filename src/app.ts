import { ExcelExtractor } from "./data-extractor/excel-extractor"
import IExtractor from "./data-extractor/extractor-i"
import express from "express"
import { VerticalSlice } from "./model/price/vertical-slice"
import { StockData } from "./model/price/stock-data"
import { parse, stringify } from "flatted"
import { Direction } from "./model/price/direction"
import { isPatternValid } from "./backtester/pattern-conditions"
import { StrategyRule } from "./backtester/model/strategy-rule"
import { GraphEntity } from "./backtester/model/graph-entity"
import { GraphEntityType } from "./backtester/types/graph-entity-type"
import { GraphPositionType } from "./backtester/types/graph-position-type"
import { BacktestData } from "./backtester/backtest/backtest"
import { PriceType } from "./backtester/types/price-type"

function setHeaders(res: any) {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000")
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE")
  res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type")
  res.setHeader("Access-Control-Allow-Credentials", true)
  res.setHeader("Content-Type", "application/json")
}

export const app = express()

const priceExtractor: IExtractor = new ExcelExtractor()

// Get price data
app.get("/stock-data", async (req: any, res: any) => {
  console.log('/stock-data called...')
  setHeaders(res)
  let stockData: StockData[] = await priceExtractor.readPriceData(false)
  let jsonNullReplacer = (key: string, value: any) => {
    if (value !== null) return value
  }  
  let jsonStockData: string = JSON.stringify(stockData, jsonNullReplacer, 2)
  res.send(jsonStockData, null, 2)
  console.log('/stock-data response = ' + jsonStockData)
})

// Do backtest
app.get("/backtest", async (req: any, res: any) => {
  console.log('/backtest called...')
  setHeaders(res)
  const stocksData: StockData[] = await priceExtractor.readPriceData(true)
  // Defined rules
  const rules: StrategyRule[] = [
    new StrategyRule({
      graphEntity1: new GraphEntity({
        id: 1,
        period: null,
        type: GraphEntityType.CLOSE,
      }),
      position: GraphPositionType.ABOVE,
      offsetPercentage: 0,
      graphEntity2: new GraphEntity({
        id: 0,
        period: null,
        type: GraphEntityType.OPEN,
      }),
    }),
  ]
  // Do backtest
  let backtestData = new BacktestData(1)
  stocksData[0].first().executeEachIteration(Direction.RIGHT, stocksData.length - 1, (price) => {
    /*
    WHY THE FCK DOES getPriceType RETURNES FALSE ALL THE FFCKING TIME!!!!!!!!!!!!!!!!!!!!!
    */
    console.log(isPatternValid(price, rules))
    console.log(VerticalSlice.getPriceType(price) == PriceType.BEARISH)
    console.log(VerticalSlice.getPriceType(price.next) == PriceType.BULLISH)
    if (
      isPatternValid(price, rules) &&
      VerticalSlice.getPriceType(price) == PriceType.BEARISH &&
      VerticalSlice.getPriceType(price.next) == PriceType.BULLISH
    )
      backtestData.doBacktest(price)
  })
  //console.log(JSON.stringify(backtestData))

  res.send({})
})
