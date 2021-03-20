import { StockData } from "../stock/stock-data";

export default interface IExtractor {
  readPriceData(withPointers: boolean): Promise<StockData[]>
}
