import { Price } from "../model/price/price"

export default interface IExtractor {
  readPriceData(): Promise<Price[][]>
}
