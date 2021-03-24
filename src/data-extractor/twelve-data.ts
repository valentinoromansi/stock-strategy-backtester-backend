import csv from "csv-parser"
import { readdir, createReadStream } from "fs"
import { yml } from "../yml/yml"
import { VerticalSlice } from "../stock/vertical-slice"
import IExtractor from "./extractor-i"
import { StockData } from "../stock/stock-data"

export class TwelveDataExtractor implements IExtractor {

  async readPriceData(withPointers: boolean = true): Promise<StockData[]> {
    return new Promise(async (resolve, rej) => {/*
        let stocksData: StockData[] = []
        //stockData.append(VerticalSlice.copy(data), withPointers)
    */})
  }

  

}