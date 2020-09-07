import { Price } from "../../../src/model/price/price"
import { PriceLinkedList } from "../../../src/model/price/price-linked-list"
import { Direction } from "../../../src/model/price/direction"

test("hasConnectedPrices must return false if there are no connected prices", () => {
  let price: Price = new Price(new Date(), 0, 0, 0, 0)
  let hasConnectedPrices: boolean

  hasConnectedPrices = price.hasConnectedPrices(Direction.LEFT, 0)
  expect(hasConnectedPrices).toBe(false)
  hasConnectedPrices = price.hasConnectedPrices(Direction.RIGHT, 0)
  expect(hasConnectedPrices).toBe(false)
  hasConnectedPrices = price.hasConnectedPrices(Direction.LEFT, 1)
  expect(hasConnectedPrices).toBe(false)
  hasConnectedPrices = price.hasConnectedPrices(Direction.RIGHT, 1)
  expect(hasConnectedPrices).toBe(false)
})

test("hasConnectedPrices must return false if there are connected price", () => {
  let prices: PriceLinkedList = new PriceLinkedList()
  prices.append(new Price(new Date(), 1, 1, 1, 1))
  prices.append(new Price(new Date(), 2, 2, 2, 2))
  let hasConnectedPrices: boolean

  hasConnectedPrices = prices.first.hasConnectedPrices(Direction.LEFT, 1)
  expect(hasConnectedPrices).toBe(false)
  hasConnectedPrices = prices.first.hasConnectedPrices(Direction.RIGHT, 1)
  expect(hasConnectedPrices).toBe(true)
  hasConnectedPrices = prices.first.hasConnectedPrices(Direction.RIGHT, 2)
  expect(hasConnectedPrices).toBe(false)
  hasConnectedPrices = prices.last.hasConnectedPrices(Direction.RIGHT, 1)
  expect(hasConnectedPrices).toBe(false)
  hasConnectedPrices = prices.last.hasConnectedPrices(Direction.LEFT, 1)
  expect(hasConnectedPrices).toBe(true)
  hasConnectedPrices = prices.last.hasConnectedPrices(Direction.LEFT, 2)
  expect(hasConnectedPrices).toBe(false)
})

test("executeEachIteration must iterate x number of times", () => {
  let prices: PriceLinkedList = new PriceLinkedList()
  prices.append(new Price(new Date(), 1, 1, 1, 1))
  prices.append(new Price(new Date(), 2, 2, 2, 2))
  let counter: number = 0
  let onEachIter = () => {
    counter++
  }

  prices.first.executeEachIteration(Direction.LEFT, 0, onEachIter)
  expect(counter).toBe(0)
  counter = 0
  prices.first.executeEachIteration(Direction.RIGHT, 0, onEachIter)
  expect(counter).toBe(0)
  counter = 0
  prices.first.executeEachIteration(Direction.RIGHT, 1, onEachIter)
  expect(counter).toBe(2)
  counter = 0
  prices.first.executeEachIteration(Direction.RIGHT, 2, onEachIter)
  expect(counter).toBe(0)
  counter = 0

  prices.last.executeEachIteration(Direction.RIGHT, 0, onEachIter)
  expect(counter).toBe(0)
  counter = 0
  prices.last.executeEachIteration(Direction.LEFT, 0, onEachIter)
  expect(counter).toBe(0)
  counter = 0
  prices.last.executeEachIteration(Direction.LEFT, 1, onEachIter)
  expect(counter).toBe(2)
  counter = 0
  prices.last.executeEachIteration(Direction.LEFT, 2, onEachIter)
  expect(counter).toBe(0)
  counter = 0
})
