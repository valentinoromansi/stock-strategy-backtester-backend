import { StockData } from "../model/price/stock-data";

export default interface IExtractor {
  readPriceData(withPointers: boolean): Promise<StockData[]>
}
