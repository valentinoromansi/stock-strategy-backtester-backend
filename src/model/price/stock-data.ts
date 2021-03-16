import { VerticalSlice } from "./vertical-slice"
import { Direction } from "./direction"

export class StockData {
  constructor() {}

  name: string = 'Stock name'
  slices: VerticalSlice[] =  []
  length: number = 0

  first(): VerticalSlice {
    return this.slices[0]
  }

  last(): VerticalSlice {
    return this.slices[this.length - 1]
  }

  append(slice: VerticalSlice, withPointers: boolean = true): VerticalSlice {
    this.length++
    this.slices.push(slice)
    if(this.slices.length > 1) {
      slice.prev = (withPointers) ? this.slices[this.length - 2] : null
      slice.prev.next = (withPointers) ? this.slices[this.length - 1] : null
    }
    return slice
  }

  print() {
    if (!this.first && !this.last) {
      console.log("Empty")
      return
    }
    let cur: VerticalSlice = this.first()
    let logStr: string = `[${cur.open.toString()}]-`
    let length: number = 1
    while (cur.next) {
      logStr += `[${cur.next.open.toString()}]-`
      cur = cur.next
      length++
    }
    console.log(length)
    console.log(logStr)
  }

  getSliceListWithoutPointers(): StockData {
    let stockData: StockData = new StockData()
    this.first().executeEachIteration(Direction.RIGHT, null, (slice) => {
      stockData.append(new VerticalSlice(slice.time, slice.high, slice.close, slice.high, slice.low))
      return true
    })
    return stockData
  }
}
