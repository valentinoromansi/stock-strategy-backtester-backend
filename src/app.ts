import { ExcelExtractor } from "./data-extractor/excel-extractor"
import IExtractor from "./data-extractor/extractor-i"
import express from "express"

function setHeaders(res: any) {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000")
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE")
  res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type")
  res.setHeader("Access-Control-Allow-Credentials", true)
  res.setHeader("Content-Type", "application/json")
}

export const app = express()

const priceExtractor: IExtractor = new ExcelExtractor()
// Get all strategies name, description and visual data
app.get("/strategies", (req: any, res: any) => {
  setHeaders(res)
  priceExtractor.readPriceData().then((data: any) => res.send(JSON.stringify({ stocksData: data }, null, 2)))
})
