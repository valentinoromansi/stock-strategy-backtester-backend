import { VerticalSlice } from "../stock/vertical-slice"
import { Stock } from "../stock/stock-data"
import { Fundamentals } from "../stock/fundamentals"
import { ApiKeysManager, ApiKey } from "../data-extractor/api-key-manager"
import { waitFor } from "../util"

const https = require("https")
const fs = require("fs")
const colors = require("colors")

const symbolsUrl = "https://api.twelvedata.com/stocks?exchange=NASDAQ"
const sliceDataUrl = (symbol: string, apikey: string, interval: string) =>
  `https://api.twelvedata.com/time_series?&symbol=${symbol}&interval=${interval}&apikey=${apikey}&outputsize=5000`
const fundamentalsUrl = (symbol: string, apikey: string) =>
  `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=${apikey}`

const APICallsPerMin = 5
const intervals = ["15min", "1h", "1day"]

let apiKeysManager: ApiKeysManager = new ApiKeysManager()

// ! API keys must be avaiable update of stock data start. If not program will not be executed correctly. For now wait time between execution must be 1 minute for keys to properly refresh.
// TODO Implement check if all keys are avaiable at start, if not exit
export class ApiReceiver {
  async fetchStockData(): Promise<boolean> {
    console.log("TwelveDataExtractor.getStockData.... started")
    return new Promise(async (resolve) => {
      // Get symbols of all existing stocks
      let allSymbols: string[] = await this.fetchStockSymbols()
      // ! Limit symbols for development. Remove this line on production.
      allSymbols = allSymbols.slice(0, 100)
      const symbolsLists = this.getListAsFroupedLists(allSymbols, APICallsPerMin)

      for (const interval of intervals) {
        let stocksFetchedCounter = 0
        for (const symbols of symbolsLists) {
          // If no api keys are available wait until one becomes available
          if (!apiKeysManager.isApiKeyAvailable()) await waitFor(apiKeysManager.getWaitingTimeInSec())
          let apiKey: ApiKey = apiKeysManager.getAvailableApiKey()
          // Fetch data
          let stocks: Stock[] = await this.fetchStock(symbols, interval, apiKey)
          // Mark used api key as used
          apiKeysManager.markApiKeyAsUsed(apiKeysManager.getAvailableApiKey())
          // Save fetched data
          await this.saveStocksJson(stocks)
          stocksFetchedCounter += stocks.length
          console.log(
            `${(stocksFetchedCounter / allSymbols.length) * 100}% stock data for ${interval} interval saved\n`
          )
        }
      }

      console.log("TwelveDataExtractor.getStockData.... ended")
      resolve(true)
    })
  }

  /**
   * Grouped fetching of stock vertical slice data and fundamentals for x num of stocks
   * TODO: See if it is possible to fetch slice data and fundamentals for all symbols in async way instead of waiting foreach symbol to finish to proceed?
   */
  async fetchStock(symbols: string[], interval: string, apiKey: ApiKey): Promise<Stock[]> {
    let stocks: Stock[] = []
    console.log(`\t ${symbols} > Fetching data... started`)
    const promises: Promise<any>[] = []
    return new Promise(async (res) => {
      for (const symbol of symbols)
        promises.push(
          this.fetchVerticalSliceData(symbol, interval, apiKey),
          this.fetchStockFundamentals(symbol, apiKey)
        )
      await Promise.all(promises).then((res: any[]) => {
        // Assign fetched: 1. vertical slice data - [i], 2. fundamentals
        for (let i = 0; i + 2 < res.length; i += 2) {
          const stock: Stock = res[i]
          // ! Stocks are being pushed even if fundamental are null
          if (stock) {
            stock.fundamentals = res[i + 1]
            stocks.push(stock)
          }
        }
      })
      console.log(`\t ${symbols} > Fetching data... ended`)
      res(stocks)
    })
  }

  /**
   * Fetch vertical slice data
   */
  async fetchVerticalSliceData(symbol: string, interval: string, apiKey: ApiKey): Promise<Stock> {
    return new Promise(async (resolve) => {
      console.log(`\t\t ${symbol} > Fetching vertical slice data from server... started`)
      const url = sliceDataUrl(symbol, apiKey.verticalSlicesAPIKey, interval)
      await https
        .get(url, (res: any) => {
          let jsonResponse: string = ""
          res.on("data", (chunk: any) => {
            jsonResponse += chunk
          })

          res.on("end", () => {
            console.log(`\t\t ${symbol} > Fetching vertical slice data from server... ended`)
            const stock: Stock = this.jsonToVerticalSliceData(symbol, jsonResponse)
            if (stock) {
              stock.slices = stock.slices.reverse()
              stock.interval = interval
            }
            resolve(stock)
          })
        })
        .on("error", (err: any) => {
          console.log("Error: " + err.message)
        })
    })
  }

  /**
   * Stock fundamentals fetch
   */
  async fetchStockFundamentals(symbol: string, apiKey: ApiKey): Promise<Fundamentals> {
    return new Promise(async (resolve) => {
      console.log(`\t\t ${symbol} > Fetching fundamentals data from server.... started`)
      const url = fundamentalsUrl(symbol, apiKey.fundamentalsAPIKey)
      await https
        .get(url, (res: any) => {
          let responseJson: string = ""
          res.on("data", (chunk: any) => {
            responseJson += chunk
          })

          res.on("end", () => {
            console.log(`\t\t ${symbol} > Fetching fundamentals data from server.... ended`)
            const jsonObj = JSON.parse(responseJson)
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

  /**
   * Get list as list with groups of @groupSize items
   * Example for getListAsGroup([a, b, c, d, e, f, g, h], 3) -> [[a, b, c], [d, e, f] , [g, h]]
   */
  getListAsFroupedLists(symbols: string[], groupSize: number): string[][] {
    let listOfLists: string[][] = []
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

  async saveStocksJson(stocks: Stock[]): Promise<boolean> {
    if (!stocks || stocks.length === 0) throw "Data could not be writen to json file, data is undefined or empty"
    return new Promise((resolve) => {
      const folderPath = `src/resources/stocks/${stocks[0].interval}`
      const fileName = `${stocks[0].symbol}-${stocks[stocks.length - 1].symbol}`
      if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath)
      fs.writeFile(`${folderPath}/${fileName}.json`, JSON.stringify(stocks), (err: any) => {
        if (err) throw err
        console.log(colors.green(`\t ${stocks.map((stock) => stock.symbol)} > Data saved!`))
        resolve(true)
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

  jsonToVerticalSliceData(symbol: string, json: string): Stock {
    const jsonObj = JSON.parse(json)
    if (jsonObj.status !== "ok") {
      console.log(colors.red(`\t\t ${symbol} > Error thrown when parsing json to object for symbol ${symbol}.`))
      return null
    }
    let stock: Stock = new Stock()
    try {
      console.log(`\t\t ${symbol} > Parsing data from json to object... started`)
      stock.symbol = symbol
      jsonObj.values.forEach((slice: any) => {
        stock.append(
          new VerticalSlice(new Date(slice.datetime), slice.open, slice.close, slice.high, slice.low, slice.volume),
          false
        )
      })
    } catch (e) {
      console.log(e)
    }
    console.log(`\t\t ${symbol} > Parsing data from json to object... ended`)

    return stock
  }
}
