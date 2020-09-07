import { Price } from "./price"

export class PriceLinkedList {
  constructor() {}
  first: Price
  last: Price

  append(price: Price): Price {
    // first price added
    if (!this.first && !this.last) {
      this.first = this.last = price
    }
    // Second added
    else if (this.first === this.last) {
      this.first.next = price
      this.last = price
      this.last.prev = this.first
    }
    // Append at the end if there are more then 2
    else {
      this.last.next = price
      price.prev = this.last
      this.last = price
    }
    return price
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
