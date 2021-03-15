import csv from "csv-parser"
import { readdir, createReadStream } from "fs"
import { yml } from "../yml/yml"
import { VerticalSlice } from "../model/price/vertical-slice"
import IExtractor from "./extractor-i"
import { StockData } from "../model/price/stock-data"

export class ExcelExtractor implements IExtractor {
  async getFileNames(dirPath: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
      readdir(dirPath, (err: any, files: string[]) => {
        if (err) reject("Unable to scan directory: " + err)
        resolve(files)
      })
    })
  }

  async extractCsvData(path: string, withPointers: boolean = true): Promise<StockData> {
    return new Promise((resolve, rej) => {
      let stockData: StockData = new StockData()
      let slice: VerticalSlice = new VerticalSlice(new Date(), 0, 0, 0, 0)
      createReadStream(path)
        .pipe(csv({}))
        .on("data", (data: VerticalSlice) => {
          stockData.append(data, withPointers)
        })
        .on("end", () => {
          resolve(stockData)
        })
    })
  }

  readPriceData(withPointers: boolean = true): Promise<StockData[]> {
    return new Promise(async (resolve, rej) => {
      const fileNames: string[] = await this.getFileNames(yml.excelPath)
      let stocksData: StockData[] = []
      for (let i = 0; i < fileNames.length; i++) {
        let extractedStockData: StockData = await this.extractCsvData(`${yml.excelPath}/${fileNames[i]}`, withPointers)
        stocksData.push(extractedStockData)
      }
      resolve(stocksData)
    })
  }
}



