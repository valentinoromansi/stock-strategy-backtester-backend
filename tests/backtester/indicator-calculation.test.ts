import { PriceLinkedList } from "../../src/model/price/price-linked-list"
import { Price } from "../../src/model/price/price"
import { smaValue, emaValue } from "../../src/backtester/indicator-calculation"

test("smaValue must properly calculate sma value", () => {
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

  let sma: number = smaValue(-1, price1)
  expect(sma).toBe(0)
  sma = smaValue(5, price1)
  expect(sma).toBe(0)
  sma = smaValue(5, price2)
  expect(sma).toBe((5 + 4 + 3 + 2 + 1) / 5)
})

test("emaValue must properly calculate ema3 value", () => {
  let prices: PriceLinkedList = new PriceLinkedList()
  prices.append(new Price(new Date(), 0, 2, 0, 0))
  prices.append(new Price(new Date(), 0, 4, 0, 0))
  prices.append(new Price(new Date(), 0, 6, 0, 0)) // sma3 = 4
  prices.append(new Price(new Date(), 0, 8, 0, 0))
  prices.append(new Price(new Date(), 0, 10, 0, 0))
  const price = prices.append(new Price(new Date(), 0, 14, 0, 0)) // ema3

  let ema: number = emaValue(3, price)
  expect(ema).toBe(11.722)
})
