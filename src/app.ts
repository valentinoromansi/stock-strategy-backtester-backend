import { ExcelExtractor } from "./data-extractor/excel-extractor"
import IExtractor from "./data-extractor/extractor-i"
import express from "express"
import { StockData } from "./model/price/stock-data"
import { Direction } from "./model/price/direction"
import { StrategyRule } from "./backtester/model/strategy-rule"
import { GraphEntity } from "./backtester/model/graph-entity"
import { GraphEntityType } from "./backtester/types/graph-entity-type"
import { GraphPositionType } from "./backtester/types/graph-position-type"
import { BacktestData } from "./backtester/backtest/backtest"
import { isPatternValid } from "./backtester/pattern-conditions"
import { VerticalSlice } from "./model/price/vertical-slice"
import { Strategy } from "./backtester/model/strategy"

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

  // Defined rules
  /**
   * 
   * 
   * 
   * DODATI GDJE JE LOSS LINE kao GraphEntity objekt unutar Strategy 
   * 
   * 
   * 
   */
  const strategy: Strategy = new Strategy({
    name: '2 bar play',
    enterEntity: new GraphEntity({
      id: 1,
      period: null,
      type1: GraphEntityType.CLOSE,
    }),
    stopLossEntity: new GraphEntity({
      id: 0,
      period: null,
      type1: GraphEntityType.OPEN,
      type2: GraphEntityType.CLOSE,
      percent: 0.5
    }),
    rules: [
      // second price closed below first close
      new StrategyRule({
        graphEntity1: new GraphEntity({
          id: 0,
          period: null,
          type1: GraphEntityType.CLOSE,
        }),
        position: GraphPositionType.ABOVE,
        graphEntity2: new GraphEntity({
          id: 1,
          period: null,
          type1: GraphEntityType.CLOSE,
        }),
      }),
      // second price closed above second candles 50% body height
      new StrategyRule({
        graphEntity1: new GraphEntity({
          id: 1,
          period: null,
          type1: GraphEntityType.CLOSE,
        }),
        position: GraphPositionType.ABOVE,
        graphEntity2: new GraphEntity({
          id: 0,
          period: null,
          type1: GraphEntityType.OPEN,
          type2: GraphEntityType.CLOSE,
          percent: 0.5
        }),
      })
    ],
  })


  let stocksData: StockData[] = await priceExtractor.readPriceData(true)
  let backtestData = new BacktestData(1)
  stocksData[0].first().executeEachIteration(Direction.RIGHT, stocksData[0].length - 1, (slice) => {
    // Test if pattern is valid for given slice
    if (isPatternValid(slice, strategy.rules)) {      
      backtestData.doBacktest(slice, strategy)
    }    
    return true
  })
  backtestData.print()  
  res.send(JSON.stringify(backtestData))
  console.log('/backtest ended...')
})
