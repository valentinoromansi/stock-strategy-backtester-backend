import { VerticalSlice } from "../stock/vertical-slice"
import IExtractor from "./extractor-i"
import { StockData } from "../stock/stock-data"
import { Fundamentals } from "../stock/fundamentals"

const https = require("https")

const symbolsUrl = "https://api.twelvedata.com/stocks?exchange=NASDAQ"
const sliceDataUrl = (symbol: string, apikey: string) =>
  `https://api.twelvedata.com/time_series?&symbol=${symbol}&interval=1h&apikey=${apikey}&outputsize=5000`
const fundamentalsUrl = (symbol: string, apikey: string) =>
  `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=${apikey}`

const stockSlicesAPIKeys = [
  "d6fa58c0870e449cba8dce5299ad20fe",
  "1e1bc0e7f2aa414086e174b890a3826a",
  "c7a59ff1b766435eae0efa2bcc9428b1",
  "40bbfe17f23b426b8425a4ef4a1db03b",
  "e7c9e1c4f83747b6852951df31fd7d48",
]
const stockFundamentalsAPIKeys = [
  "6I0BYWVEBUDZTPV6",
  "IDA8P4QU50KOIVVO",
  "IGCCZQXJO67364SJ",
  "N9BUTXAUVDUV949O",
  "U3K428ORVM0N42N5",
  "MRZO4BIL8UQMK5LP",
  "FNB287BIC507MG2I",
  "UTTQ4SM03UI47BJ4",
  "HWFEH91TR358F97Q",
  "VBXNLKW2KO52CO91",
]
const APICallsPerMin = 5

export class ApiExtractor implements IExtractor {
  async getStockData(withPointers: boolean): Promise<StockData[]> {
    console.log("TwelveDataExtractor.getStockData.... started")
    return new Promise(async (resolve) => {
      let stocks: StockData[] = []
      // Get symbols of all existing stocks
      const symbols: string[] = await this.fetchStockSymbols()
      // Fetch vertical slice data
      const stock: StockData = await this.fetchVerticalSliceData(symbols[0])
      // Fetch fundamentals data
      stock.fundamentals = await this.fetchStockFundamentals(symbols[0])

      stocks.push(stock)
      console.log("TwelveDataExtractor.getStockData.... ended")
      resolve(stocks)
    })
  }

  async fetchStockSymbols(): Promise<string[]> {
    return new Promise(async (resolve) => {
      console.log("fetching basic stock data from server.... started")
      await https
        .get(symbolsUrl, (res: any) => {
          let json: string = ""
          res.on("data", (chunk: any) => {
            json += chunk
          })

          res.on("end", () => {
            const jsonObj: { data: [{ symbol: string }] } = JSON.parse(json)
            const symbols: string[] = jsonObj.data.map((item: { symbol: string }) => item.symbol)
            const uniqueSymbols: string[] = Array.from(new Set(symbols))
            console.log("fetching basic stock data from server.... ended")
            resolve(uniqueSymbols)
          })
        })
        .on("error", (err: any) => {
          console.log("Error: " + err.message)
        })
    })
  }

  async fetchVerticalSliceData(symbol: string): Promise<StockData> {
    return new Promise(async (resolve) => {
      console.log("fetching data from server.... started")
      const url = sliceDataUrl(symbol, stockSlicesAPIKeys[0])
      await https
        .get(url, (res: any) => {
          let jsonResponse: string = ""
          res.on("data", (chunk: any) => {
            jsonResponse += chunk
          })

          res.on("end", () => {
            console.log("fetching data from server.... ended")
            const stock: StockData = this.parseResponseJsonToModel(symbol, jsonResponse)
            resolve(stock)
          })
        })
        .on("error", (err: any) => {
          console.log("Error: " + err.message)
        })
    })
  }

  parseResponseJsonToModel(symbol: string, json: string): StockData {
    const jsonObj = JSON.parse(json)
    let stock: StockData = new StockData()
    try {
      console.log("Parsing stock data with symbol=" + symbol + "...")
      if (jsonObj.status !== "ok") {
        throw new Error(`Error thrown when parsing symbol ${symbol}`)
      }
      console.log(symbol + "\t extraction status = " + jsonObj.status)
      stock.symbol = symbol
      jsonObj.values.forEach((jsonSlice: any) => {
        stock.append(
          new VerticalSlice(
            new Date(jsonSlice.datetime),
            jsonSlice.open,
            jsonSlice.close,
            jsonSlice.high,
            jsonSlice.low,
            jsonSlice.volume
          ),
          false
        )
      })
    } catch (e) {
      console.log(e)
    }
    return stock
  }

  async fetchStockFundamentals(symbol: string): Promise<Fundamentals> {
    return new Promise(async (resolve) => {
      console.log("fetching stock fundamentals from server.... started")
      const url = fundamentalsUrl(symbol, stockSlicesAPIKeys[0])
      await https
        .get(url, (res: any) => {
          let jsonResponse: string = ""
          res.on("data", (chunk: any) => {
            jsonResponse += chunk
          })

          res.on("end", () => {
            console.log("fetching stock fundamentals from server.... ended")
            const jsonObj = JSON.parse(jsonResponse)
            const fundamentals = new Fundamentals(
              jsonObj.AssetType,
              jsonObj.Sector,
              jsonObj.Industry,
              jsonObj.MarketCapitalization,
              jsonObj.SharesOutstanding,
              jsonObj.SharesFloat,
              jsonObj.SharesShort
            )
            resolve(fundamentals)
          })
        })
        .on("error", (err: any) => {
          console.log("Error: " + err.message)
        })
    })
  }
}
