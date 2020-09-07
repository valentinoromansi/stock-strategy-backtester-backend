import { PriceLinkedList } from "../../src/model/price/price-linked-list"
import { Price } from "../../src/model/price/price"
import { emaValue } from "../../src/backtester/indicator-calculation"

test("emaValue must properly calculate ema value", () => {
  let prices: PriceLinkedList = new PriceLinkedList()
  prices.append(new Price(new Date(), 0, 1, 0, 0))
  prices.append(new Price(new Date(), 0, 2, 0, 0))
  prices.append(new Price(new Date(), 0, 3, 0, 0))
  let price1 = prices.append(new Price(new Date(), 0, 4, 0, 0))
  let price2 = prices.append(new Price(new Date(), 0, 5, 0, 0))
  prices.append(new Price(new Date(), 0, 6, 0, 0))
  prices.append(new Price(new Date(), 0, 7, 0, 0))
  prices.append(new Price(new Date(), 0, 8, 0, 0))
  prices.append(new Price(new Date(), 0, 9, 0, 0))

  let ema: number = emaValue(-1, price1)
  expect(ema).toBe(0)
  ema = emaValue(5, price1)
  expect(ema).toBe(0)
  ema = emaValue(5, price2)
  expect(ema).toBe((5 + 4 + 3 + 2 + 1) / 5)
})
