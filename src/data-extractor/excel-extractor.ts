import csv from "csv-parser"
import { readdir, createReadStream } from "fs"
import { yml } from "../yml/yml"
import { Price } from "../model/price/price"
import IExtractor from "./extractor-i"

export class ExcelExtractor implements IExtractor {
  async getFileNames(dirPath: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
      readdir(dirPath, (err: any, files: string[]) => {
        if (err) reject("Unable to scan directory: " + err)
        resolve(files)
      })
    })
  }

  async extractCsvData(path: string): Promise<Price[]> {
    return new Promise((resolve, rej) => {
      let results: Price[] = []
      let price: Price = new Price(new Date(), 0, 0, 0, 0)
      createReadStream(path)
        .pipe(csv({}))
        .on("data", (data: Price) => {
          data.prev = 
          price.next         
          results.push(data)
        })
        .on("end", () => {
          resolve(results)
        })
    })
  }

  readPriceData(): Promise<Price[][]> {
    return new Promise(async (resolve, rej) => {
      const fileNames: string[] = await this.getFileNames(yml.excelPath)
      let prices: Price[] = []
      let allParsedCsv: Price[][] = []
      for (let i = 0; i < fileNames.length; i++) {
        let extractedCsvData: Price[] = await this.extractCsvData(`${yml.excelPath}/${fileNames[i]}`)
        allParsedCsv.push(extractedCsvData)
      }
      resolve(allParsedCsv)
    })
  }
}



