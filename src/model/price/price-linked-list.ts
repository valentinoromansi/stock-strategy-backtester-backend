import { Price } from "./price"

export class PriceLinkedList {
  constructor() {}
  first: Price
  last: Price

  append(price: Price) {
    if (!this.first && !this.last) {
      this.first = this.last = price
    } else {
      price.prev = this.last
      this.last.next = price
    }
  }

  print() {
    if (!this.first && !this.last) {
      console.log("Empty")
      return
    }
    let cur: Price = this.first
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
}

/*
let list: PriceLinkedList = new PriceLinkedList()
list.append(new Price(new Date(), 0, 0, 0, 0))
list.append(new Price(new Date(), 123, 0, 0, 0))
list.print()

let list2: PriceLinkedList = new PriceLinkedList()
list2.print()
*/