import { Stock } from "../stock/stock-data"
import { VerticalSlice } from "../stock/vertical-slice"

const fs = require("fs")

export function readStocksJsonAndParse(json: string): Stock[] {
  let stocksData: Stock[] = []
  const objList = JSON.parse(json)
  for (const obj of objList) {
    let stock: Stock = new Stock()
    stock.symbol = obj.symbol
    stock.interval = obj.interval
    stock.fundamentals = obj.fundamentals
    for (const jsonSlice of obj.slices) {
      stock.append(
        new VerticalSlice(
          jsonSlice.date,
          jsonSlice.open,
          jsonSlice.close,
          jsonSlice.high,
          jsonSlice.low,
          jsonSlice.volume
        )
      )
    }
    stocksData.push(stock)
  }
  return stocksData
}
