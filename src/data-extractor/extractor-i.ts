import { StockData } from "../stock/stock-data";

export default interface IExtractor {
  getStockData(withPointers: boolean): Promise<StockData[]>
}
