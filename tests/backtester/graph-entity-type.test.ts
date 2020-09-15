import { PriceLinkedList } from "../../src/model/price/price-linked-list"
import { Price } from "../../src/model/price/price"
import { smaValue } from "../../src/backtester/indicator-calculation"
import { GraphEntityType } from "../../src/backtester/types/graph-entity-type"

test("Value from enum string to enum", () => {
  expect(GraphEntityType["OPEN"]).toBe(GraphEntityType.OPEN)
  expect(GraphEntityType.OPEN.toString()).toBe("OPEN")
})
