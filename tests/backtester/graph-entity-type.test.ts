import { StockData } from "../../src/model/price/stock-data"
import { VerticalSlice } from "../../src/model/price/vertical-slice"
import { smaValue } from "../../src/backtester/indicator-calculation"
import { GraphEntityType } from "../../src/backtester/types/graph-entity-type"

test("Value from enum string to enum", () => {
  expect(GraphEntityType["OPEN"]).toBe(GraphEntityType.OPEN)
  expect(GraphEntityType.OPEN.toString()).toBe("OPEN")
})
