export class Price {
  constructor(time: Date, open: number, close: number, high: number, low: number) {
    this.time = time
    this.open = open
    this.close = close
    this.high = high
    this.low = low
  }

  time: Date
  open: number
  close: number
  high: number
  low: number
  next: Price
  prev: Price
}
