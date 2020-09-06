import { Price } from "../model/price"

export default interface IExtractor {
  readPriceData(): Promise<Price[][]>
}
