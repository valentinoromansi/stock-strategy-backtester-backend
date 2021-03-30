import { VerticalSlice } from "../stock/vertical-slice"
import { StockData } from "../stock/stock-data"
import { Fundamentals } from "../stock/fundamentals"
import { ApiKeysManager, ApiKey } from "../data-extractor/api-key-manager"
import { waitFor } from "../util"

const https = require("https")
const fs = require("fs")

const symbolsUrl = "https://api.twelvedata.com/stocks?exchange=NASDAQ"
const sliceDataUrl = (symbol: string, apikey: string, interval: string) =>
  `https://api.twelvedata.com/time_series?&symbol=${symbol}&interval=${interval}&apikey=${apikey}&outputsize=5000`
const fundamentalsUrl = (symbol: string, apikey: string) =>
  `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=${apikey}`

const APICallsPerMin = 5
const intervals = ["15min", "1h"]

let apiKeysManager: ApiKeysManager = new ApiKeysManager()

export class ApiReceiver {
  async updateStockData(): Promise<boolean> {
    console.log("TwelveDataExtractor.getStockData.... started")
    return new Promise(async (resolve) => {
      // Get symbols of all existing stocks
      let symbols: string[] = await this.fetchStockSymbols()
      const symbolsGrouped = this.getListAsGroup(symbols, APICallsPerMin)

      for (const interval of intervals) {
        let stocksFetchedCounter = 0
        for (const symbolsGroup of symbolsGrouped) {
          // If no api keys are available wait until they become available
          if (!apiKeysManager.isApiKeyAvailable()) await waitFor(apiKeysManager.getWaitingTimeInSec())
          // Fetch data
          let stockDataForSave: StockData[] = await this.fetchStockData(symbolsGroup, interval)
          // set used api key as used
          apiKeysManager.useApiKey(apiKeysManager.getAvailableApiKey())
          // Save fetched data
          await this.writeStockJsonData(stockDataForSave)
          console.log(`\t ${symbolsGroup} > Data saved!`)
          stocksFetchedCounter += stockDataForSave.length
          console.log(`${(stocksFetchedCounter / symbols.length) * 100}% stock data for ${interval} interval saved\n`)
        }
      }

      console.log("TwelveDataExtractor.getStockData.... ended")
      resolve(true)
    })
  }

  /**
   * Grouped fetching of stock vertical slice data and fundamentals for x num of stocks
   */
  async fetchStockData(symbols: string[], interval: string): Promise<StockData[]> {
    let stockData: StockData[] = []
    console.log(`\t ${symbols} > Fetching data... started`)
    return new Promise(async (res) => {
      for (const symbol of symbols) {
        const promises: Promise<any>[] = [
          this.fetchVerticalSliceData(symbol, interval),
          this.fetchStockFundamentals(symbol),
        ]
        await Promise.all(promises).then((res) => {
          // Assign fetched vertical slice data
          const stock: StockData = res[0]
          // Assign fetched fundamentals data
          stock.fundamentals = res[1]
          stockData.push(stock)
        })
      }
      console.log(`\t ${symbols} > Fetching data... ended`)
      res(stockData)
    })
  }

  /**
   * Get list as list with groups of 5 items
   */
  getListAsGroup(symbols: string[], groupSize: number): any {
    let listOfLists: any = []
    symbols.forEach((symbol, i) => {
      if (i % groupSize === 0) {
        const to = Math.min(i + groupSize, symbols.length)
        listOfLists.push(symbols.slice(i, to))
      }
    })
    return listOfLists
  }

  /**
   * JSON reading writing
   */

  async writeStockJsonData(data: StockData[]): Promise<boolean> {
    if (!data || data.length === 0) throw "Data could not be writen to json file, data is undefined or empty"
    const dataAsJson = JSON.stringify(data)
    return new Promise((resolve) => {
      const folderPath = `src/resources/json/stocks/${data[0].interval}`
      const fileName = `${data[0].symbol}-${data[data.length - 1].symbol}`
      if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath)
      fs.writeFile(`${folderPath}/${fileName}.json`, dataAsJson, (err: any) => {
        if (err) throw err
        resolve(true)
      })
    })
  }

  async readStockJsonData(): Promise<string> {
    return new Promise((resolve) => {
      fs.readFile("src/resources/json/stock-data-test.json", (err: any, data: any) => {
        if (err) throw err
        resolve(JSON.parse(data))
      })
    })
  }

  /**
   * Stock symbols fetch
   */

  async fetchStockSymbols(): Promise<string[]> {
    return new Promise(async (resolve) => {
      console.log(`\tFetching symbols from server.... started`)
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
            console.log(`\tFetching symbols from server.... ended`)
            resolve(uniqueSymbols)
          })
        })
        .on("error", (err: any) => {
          console.log("Error: " + err.message)
        })
    })
  }

  /**
   * Stock vertical slice data fetch
   */

  async fetchVerticalSliceData(symbol: string, interval: string): Promise<StockData> {
    return new Promise(async (resolve) => {
      console.log(`\t\t ${symbol} > Fetching vertical slice data from server... started`)
      const url = sliceDataUrl(symbol, apiKeysManager.getAvailableApiKey().verticalSlicesAPIKey, interval)
      await https
        .get(url, (res: any) => {
          let jsonResponse: string = ""
          res.on("data", (chunk: any) => {
            jsonResponse += chunk
          })

          res.on("end", () => {
            console.log(`\t\t ${symbol} > Fetching vertical slice data from server... ended`)
            const stock: StockData = this.jsonToVerticalSliceData(symbol, jsonResponse)
            stock.slices = stock.slices.reverse()
            stock.interval = interval
            resolve(stock)
          })
        })
        .on("error", (err: any) => {
          console.log("Error: " + err.message)
        })
    })
  }

  jsonToVerticalSliceData(symbol: string, json: string): StockData {
    const jsonObj = JSON.parse(json)
    let stock: StockData = new StockData()
    try {
      console.log(`\t\t ${symbol} > Parsing data from json to object... started`)
      if (jsonObj.status !== "ok") {
        throw new Error(`Error thrown when parsing symbol ${symbol}. Json object status was not 'ok'.`)
      }
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
    console.log(`\t\t ${symbol} > Parsing data from json to object... ended`)

    return stock
  }

  /**
   * Stock fundamentals fetch
   */

  async fetchStockFundamentals(symbol: string): Promise<Fundamentals> {
    return new Promise(async (resolve) => {
      console.log(`\t\t ${symbol} > Fetching fundamentals data from server.... started`)
      const url = fundamentalsUrl(symbol, apiKeysManager.getAvailableApiKey().verticalSlicesAPIKey)
      await https
        .get(url, (res: any) => {
          let jsonResponse: string = ""
          res.on("data", (chunk: any) => {
            jsonResponse += chunk
          })

          res.on("end", () => {
            console.log(`\t\t ${symbol} > Fetching fundamentals data from server.... ended`)
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
