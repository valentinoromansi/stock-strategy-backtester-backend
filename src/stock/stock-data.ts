import { VerticalSlice } from "./vertical-slice"
import { Direction } from "../types/direction"
import { Fundamentals } from "./fundamentals"

export class StockData {
  constructor() {}

  symbol: string
  fundamentals: Fundamentals
  interval: string
  slices: VerticalSlice[] = []

  first(): VerticalSlice {
    return this.slices[0]
  }

  last(): VerticalSlice {
    return this.slices[this.length() - 1]
  }

  length(): number {
    return this.slices.length
  }

  append(slice: VerticalSlice, withPointers: boolean = true): VerticalSlice {
    this.slices.push(slice)
    if (this.slices.length > 1 && withPointers) {
      slice.prev = this.slices[this.length() - 2]
      slice.prev.next = this.slices[this.length() - 1]
    }
    return slice
  }

  getSliceListWithoutPointers(): StockData {
    let stockData: StockData = new StockData()
    this.first().executeEachIteration(Direction.RIGHT, null, (slice) => {
      stockData.append(new VerticalSlice(slice.date, slice.high, slice.close, slice.high, slice.low, slice.volume))
      return true
    })
    return stockData
  }

  static getParsedJsonData(json: string): StockData[] {
    let stocksData: StockData[] = []
    const objList = JSON.parse(json)
    for (const obj of objList) {
      let stock: StockData = new StockData()
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
}
