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
import { ConditionalRule } from "./strategy/conditional-rule"
import { RequestAuthenticate, RequestDeleteStrategy, RequestGetStock, RequestSaveStrategy, RequestUpdateStrategyReports } from "./types/service-request"
import { validateAuthenticateRequest, validateDeleteStrategyRequest, validateGetStockRequest, validateSaveStrategyRequest, validateUpdateStrategyReportsRequest } from "./request-validation"

export const app = express()
app.use(express.json())
// Cors is used for this reason: https://dev.to/p0oker/why-is-my-browser-sending-an-options-http-request-instead-of-post-5621
app.use(cors())

const apiReceiver: ApiReceiver = new ApiReceiver()



app.post("/get-stock", authenticateAccessToken, validateGetStockRequest, async (req: RequestGetStock, res: any) => {
  console.log("/get-stock called...")
  console.time(colors.yellow("/get-stock"))
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
  console.timeEnd(colors.yellow("/get-stock"))
  console.log(colors.green(`/get-stock ended...`))
})



// Update stock data and save it in resources/stocks
app.post("/update-stock-data", authenticateAccessToken, async (req: any, res: any) => {
  console.log("/update-stock-data called...")
  console.time(colors.yellow("/update-stock-data"))
  setHeaders(res)
  const status: boolean = await apiReceiver.fetchStockData()
  res.send(new ServiceResponse({status: 200}))
  console.timeEnd(colors.yellow("/update-stock-data"))
  console.log(colors.green(`/update-stock-data ended...`))
})



// Save strategy in resurces/strategies.json
app.post("/save-strategy", authenticateAccessToken, validateSaveStrategyRequest, async (req: RequestSaveStrategy, res: any) => {
  console.log("/save-strategy called...")
  console.time(colors.yellow("/save-strategy"))
  setHeaders(res)
  let strategy: Strategy = req.body
  if(!strategy.riskToRewardList || strategy.riskToRewardList?.length === 0)
    strategy.riskToRewardList = [1, 2]
  await saveStrategyJson(strategy)
  res.send(new ServiceResponse({status: 200}))
  console.timeEnd(colors.yellow("/save-strategy"))
  console.log(colors.green(`/save-strategy ended...`))
})

// Reads strategies from resurces/strategies.json, removes strategy with name from request, saves new list in resurces/strategies.json
app.post("/delete-strategy", authenticateAccessToken, validateDeleteStrategyRequest, async (req: RequestDeleteStrategy, res: any) => {
  console.log("/delete-strategy called...")
  console.time(colors.yellow("/delete-strategy"));
  setHeaders(res)
  const isDeleted: boolean = await deleteStrategy(req.body.name)
  if(isDeleted)
    res.send(new ServiceResponse({status: 200}))
  else 
    res.send(new ServiceResponse({status: 400, message: `Strategy '${req.body.name}' could not be deleted!`}))
  console.timeEnd(colors.yellow("/delete-strategy"));
  console.log(colors.green(`/delete-strategy ended...`))
})

// Fetch strategy from resurces/strategies.json
app.get("/get-strategies", authenticateAccessToken, async (req: any, res: any) => {
  console.log("/get-strategies called...")
  console.time(colors.yellow("/get-strategies"));
  setHeaders(res)
  let strategies: Strategy[] = await readStrategiesJsonAndParse()
  res.send(new ServiceResponse({data: strategies, status: 200}))
  console.timeEnd(colors.yellow("/get-strategies"));
  console.log(colors.green(`/get-strategies ended...`))
})

// Do backtest and update strategy reports with results
// If strategyName is provided in request body then generate reports only for that strategy. If not then generate reports for all strategies.
app.post("/update-strategy-reports", authenticateAccessToken, validateUpdateStrategyReportsRequest, async (req: RequestUpdateStrategyReports, res) => {
  console.log(`/update-strategy-reports called ${req.body.strategyName ? 'with ' + req.body.strategyName : ''} ...`)
  console.time(colors.yellow("/update-strategy-reports"));
  setHeaders(res)
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
  console.timeEnd(colors.yellow("/update-strategy-reports"));
  console.log(colors.green(`/update-strategy-reports ended...`))
})

// Get strategy reports
app.get("/get-strategy-reports", authenticateAccessToken, async (req: any, res: any) => {
  console.log("/get-strategy-reports called...")
  console.time(colors.yellow("/get-strategy-reports"));
  setHeaders(res)
  let strategyReports: StrategyReport[] = await readStrategyReportsJsonAndParse()
  res.send(new ServiceResponse({data: strategyReports, status: 200}))
  console.timeEnd(colors.yellow("/get-strategy-reports"));
  console.log(colors.green(`/get-strategy-reports ended...`))
})


// Authenticate user and send access key back
app.post("/authenticate", validateAuthenticateRequest, async (req: RequestAuthenticate, res: any) => {
  console.log(`authenticate called... for user="${req.body.username}"`)
  console.time(colors.yellow("/authenticate"));
  setHeaders(res)
  const authenticated = authenticateUserCredentials(req.body)
  if(!authenticated) {
    res.send(new ServiceResponse({message: `Authentification failed for user ${req.body.username}!`, status: 400}))
    return
  }
  const token = generateAccessToken(req.body)
  res.send(new ServiceResponse({data: token, status: 200}))
  console.timeEnd(colors.yellow(`/authenticate`))
  console.log(colors.green(`/authenticate ended...`))
})
