import express from "express"
import colors from "colors"
import fs from "fs"
var cors = require("cors")
import { Stock } from "./stock/stock-data"
import { Direction } from "./types/direction"
import { BacktestResult } from "./backtest/backtest-result"
import { isPatternValid } from "./pattern-validator/pattern-validator"
import { Strategy } from "./strategy/strategy"
import { StrategyReport } from "./backtest/strategy-backtest-results"
import { ApiReceiver } from "./data-extractor/api-receiver"
import {
  deleteStrategy,
  readStocksJsonAndParse,
  readStrategiesJsonAndParse,
  readStrategyReportsJsonAndParse,
  saveStrategyJson,
  saveStrategyReportsJson,
} from "./data-extractor/json-manager"
import { yml } from "./yml/yml"

function setHeaders(res: any) {
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE")
  res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,Content-Type")
  res.setHeader("Access-Control-Allow-Credentials", true)
  res.setHeader("Content-Type", "application/json")
}

import { stringify } from "flatted"
import { authenticateAccessToken, authenticateUserCredentials, AuthentificationCredentials, generateAccessToken } from "./authentification/authentification"
import { ServiceResponse } from "./types/service-response"

export const app = express()
app.use(express.json())
// Cors is used for this reason: https://dev.to/p0oker/why-is-my-browser-sending-an-options-http-request-instead-of-post-5621
app.use(cors())

const apiReceiver: ApiReceiver = new ApiReceiver()



app.get("/", async (req, res) => {
  res.send(
    `
  <h1>Todo REST API</h1>
  <h2>Available Routes</h2>
  <pre>
    GET, POST /todos
    GET, PUT, DELETE /todos/:id
  </pre>
  `.trim(),
  );
});


// ! Get stock - change to GEt method or leave POST but rename + validate request -> exception thrown otherwise
app.post("/get-stock", authenticateAccessToken, async (req: any, res: any) => {
  console.log("/get-stock called...")
  setHeaders(res)
  const { interval, symbol } = req.body
  let stock: Stock
  const fileNames: string[] = fs.readdirSync(`${yml.stocksPath}/${interval}`).map((file: string) => file)
  for (const fileName of fileNames) {
    if (stock) break
    const json = fs.readFileSync(`${yml.stocksPath}/${interval}/${fileName}`, { encoding: "utf8" })
    const stocks: Stock[] = readStocksJsonAndParse(json)
    for (const s of stocks)
      if (s.symbol === symbol) {
        stock = s
        break
      }
  }
  res.send(new ServiceResponse({data: stock.slicesToObject(), status: 200}))
  console.log(colors.green(`/get-stock ended...`))
})

// Update stock data and save it in resources/stocks
app.post("/update-stock-data", authenticateAccessToken, async (req: any, res: any) => {
  console.log("/update-stock-data called...")
  setHeaders(res)
  const status: boolean = await apiReceiver.fetchStockData()
  res.send(new ServiceResponse({status: 200}))
  console.log(colors.green(`/update-stock-data ended...`))
})

// Save strategy in resurces/strategies.json
// ? Add validations for req object
app.post("/save-strategy", authenticateAccessToken, async (req: any, res: any) => {
  console.log("/save-strategy called...")
  console.log(colors.green(req.body))
  setHeaders(res)
  let strategy: Strategy = req.body
  if(!strategy.riskToRewardList || strategy.riskToRewardList?.length === 0)
    strategy.riskToRewardList = [1, 2]
  const isSaved: boolean = await saveStrategyJson(strategy)
  console.log(colors.green(`/save-strategy ended...`))
  res.send(new ServiceResponse({status: 200}))
})

// Reads strategies from resurces/strategies.json, removes strategy with name from request, saves new list in resurces/strategies.json
// ? Add validations for req object
app.post("/delete-strategy", authenticateAccessToken, async (req: any, res: any) => {
  console.log("/delete-strategy called...")
  console.log(colors.green(req.body))
  setHeaders(res)
  const isDeleted: boolean = await deleteStrategy(req.body.name)
  console.log(colors.green(`/delete-strategy ended...`))
  res.send(new ServiceResponse({status: 200}))
})

// Fetch strategy from resurces/strategies.json
app.get("/get-strategies", authenticateAccessToken, async (req: any, res: any) => {
  console.log("/get-strategies called...")
  setHeaders(res)
  let strategies: Strategy[] = await readStrategiesJsonAndParse()
  console.log(colors.green(`/get-strategies ended...`))
  res.send(new ServiceResponse({data: strategies, status: 200}))
})

// Do backtest and update strategy reports
// If strategyName is in request body then do backtest and update only that strategy report. If not then do it for all.
// ? Add validations for req object before calling 'Strategy.copy(req.body)'
// ? import { validate, Matches, IsDefined } from "class-validator";
// ? import { plainToClass, Expose } from "class-transformer";
app.post("/update-strategy-reports",authenticateAccessToken, async (req, res) => {
  console.log("/update-strategy-reports called...")
  setHeaders(res)
  console.log("Request: ", req.body)
  let strategies: Strategy[] = await readStrategiesJsonAndParse()
  if (req?.body?.strategyName !== undefined) 
    strategies = strategies.filter((obj) => obj.name === req.body.strategyName)
  let strategyReports: StrategyReport[] = []
  strategies.forEach((strategy) => {
    console.log(strategy.description())
    // ! Read all strategies from strategies.json and return list of reports insted of 1 report
    let strategyReport = new StrategyReport(strategy.name, [])
    const intervals: string[] = fs.readdirSync(yml.stocksPath).map((file: string) => file)
    for (const interval of intervals) {
      let stocks: Stock[] = []
      const fileNames: string[] = fs.readdirSync(`${yml.stocksPath}/${interval}`).map((file: string) => file)
      for (const fileName of fileNames) {
        const json = fs.readFileSync(`${yml.stocksPath}/${interval}/${fileName}`, {
          encoding: "utf8",
        })
        stocks = readStocksJsonAndParse(json)
        // For stock read from current json file
        for (const stock of stocks) {
          // If stock data is not valid skip it
          const isValid: boolean = stock.symbol && stock.symbol && stock.slices && stock.slices?.length > 0
          if (!isValid) continue
          // Do backtest for valid stock data for every risk to reward value
          for (const rewardToRisk of strategy.riskToRewardList) {
            let backtestResult = new BacktestResult(stock, rewardToRisk)
            stock.first().executeEachIteration(Direction.RIGHT, stock.length() - 1, (slice) => {
              // Execute backtest if pattern is valid for given slice
              if (isPatternValid(slice, strategy)) 
                backtestResult.doBacktest(slice, strategy)
              return true
            })
            strategyReport.backtestResults.push(backtestResult)
          }
        }
      }
    }
    strategyReports.push(strategyReport)
  })
  // Save updated strategy reports as JSON
  await saveStrategyReportsJson(strategyReports)

  // Send back all strategy reports including updated ones
  let newStrategyReports: StrategyReport[] = await readStrategyReportsJsonAndParse()
  res.send(new ServiceResponse({data: newStrategyReports, status: 200}))
  console.log(colors.green(`/update-strategy-reports ended...`))
})

// Save strategy in resurces/strategies.json
app.get("/get-strategy-reports", authenticateAccessToken, async (req: any, res: any) => {
  console.log("/get-strategy-reports called...")
  setHeaders(res)
  let strategyReports: StrategyReport[] = await readStrategyReportsJsonAndParse()
  console.log(colors.green(`/get-strategy-reports ended...`))
  res.send(new ServiceResponse({data: strategyReports, status: 200}))
})


// Authenticate user and send access key back
app.post("/authenticate", async (req: {body: AuthentificationCredentials}, res: any) => {
  console.log(`authenticate called... for user="${req.body.user}"`)
  setHeaders(res)
  const authenticated = authenticateUserCredentials(req.body)
  if(!authenticated) {
    res.send(new ServiceResponse({message: `Authentification failed for user ${req.body.user}!`, status: 400}))
    return
  }
  const token = generateAccessToken(req.body)
  res.send(new ServiceResponse({data: token, status: 200}))
  console.log(colors.green(`/authenticate ended...`))
})
