import csv from "csv-parser"
import { readdir, createReadStream } from "fs"
import { yml } from "../yml/yml"
import { VerticalSlice } from "../stock/vertical-slice"
import IExtractor from "./extractor-i"
import { StockData } from "../stock/stock-data"

export class ExcelExtractor implements IExtractor {

  async getStockData(withPointers: boolean = true): Promise<StockData[]> {
    return new Promise(async (resolve, rej) => {
      const fileNames: string[] = await this.getFileNames(yml.excelPath)
      let stocksData: StockData[] = []
      for (let i = 0; i < fileNames.length; i++) {
        let extractedStockData: StockData = await this.extractCsvData(`${yml.excelPath}/${fileNames[i]}`, withPointers)
        stocksData.push(extractedStockData)
        stocksData[i].symbol = fileNames[i]
      }
      resolve(stocksData)
    })
  }

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
      createReadStream(path)
        .pipe(csv({}))
        .on("data", (data: any) => {
          stockData.append(VerticalSlice.copy(data), withPointers)
        })
        .on("end", () => {
          resolve(stockData)
        })
    })
  }

}



