import { VerticalSlice } from "./vertical-slice"
import { Direction } from "../types/direction"
import { Fundamentals } from "./fundamentals"

export class Stock {
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

  getSliceListWithoutPointers(): Stock {
    let stock: Stock = new Stock()
    this.first().executeEachIteration(Direction.RIGHT, null, (slice) => {
      stock.append(new VerticalSlice(slice.date, slice.high, slice.close, slice.high, slice.low, slice.volume))
      return true
    })
    return stock
  }

  slicesToObject(): {date: Date, open: number, close: number, high: number, low: number, volume: number}[] {
    let slices: {date: Date, open: number, close: number, high: number, low: number, volume: number}[] = []
    this.first().executeEachIteration(Direction.RIGHT, null, (slice) => {
      slices.push({date: slice.date, open: slice.open, close: slice.close, high: slice.high, low: slice.low, volume: slice.volume})
      return true
    })
    return slices
  }

  static fromJson(json: string): Stock[] {
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
}
