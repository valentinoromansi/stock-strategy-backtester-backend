import { Stock } from "../stock/stock-data"
import { VerticalSlice } from "../stock/vertical-slice"
import { Strategy } from "../strategy/strategy"
import { yml } from "../yml/yml"
import colors from "colors"
import { StrategyReport } from "../backtest/strategy-backtest-results"

const fs = require("fs")

export function readStocksJsonAndParse(json: string): Stock[] {
  let stocksData: Stock[] = []
  const objList = JSON.parse(json)
  for (const obj of objList) {
    let stock: Stock = new Stock()
    stock.symbol = obj.symbol
    stock.interval = obj.interval
    stock.fundamentals = obj.fundamentals
    for (const jsonSlice of obj.slices) {
      stock.append(
        new VerticalSlice(
          jsonSlice.date,
          jsonSlice.open,
          jsonSlice.close,
          jsonSlice.high,
          jsonSlice.low,
          jsonSlice.volume
        )
      )
    }
    stocksData.push(stock)
  }
  return stocksData
}




export async function readStrategiesJsonAndParse(): Promise<Strategy[]> {
  return new Promise(resolve => {
    const filePath = `${yml.strategiesFilePath}`
    if (!fs.existsSync(filePath)) {
      console.log(colors.red(`File ${yml.strategiesFilePath} does not exist!`))
      resolve([])
    }
    else {
      let json = fs.readFileSync(`${yml.strategiesFilePath}`, {
        encoding: "utf8",
      })
      let strategies: Strategy[]
      try {
        strategies = JSON.parse(json);
      } catch (e) {
        console.log(colors.red(`readStrategiesJsonAndParse -> Parsing ${yml.strategiesFilePath} json failed!`))
        resolve([]);
      }
      resolve(strategies)
    }
  })
}


export function saveStrategyJson(strategy: Strategy): Promise<boolean> {
  return new Promise(async(resolve) => {
    let strategies: Strategy[] = await readStrategiesJsonAndParse()
    strategies = strategies.filter(obj => obj.name !== strategy.name);
    strategies.push(strategy);
    const filePath = `${yml.strategiesFilePath}`
    fs.writeFile(filePath, JSON.stringify(strategies), (err: any) => {
      if (err) {
        console.log(colors.red(`\t Strategy ${strategy.name} saved FAILED with error => ${err}`))
        resolve(false)
      }
      console.log(colors.green(`\t Strategy ${strategy.name} saved!`))
      resolve(true)
    })
  })
}




export async function readBacktestReportsJsonAndParse(): Promise<StrategyReport[]> {
  return new Promise(resolve => {
    const filePath = `${yml.backtestReportsFilePath}`
    if (!fs.existsSync(filePath)) {
      console.log(colors.red(`File ${yml.backtestReportsFilePath} does not exist!`))
      resolve([])
    }
    else {
      let json = fs.readFileSync(`${yml.backtestReportsFilePath}`, {
        encoding: "utf8",
      })
      let reports: StrategyReport[]
      try {
        reports = JSON.parse(json);
      } catch (e) {
        console.log(colors.red(`readBacktestReportsJsonAndParse -> Parsing ${yml.backtestReportsFilePath} json failed!`))
        resolve([]);
      }
      resolve(reports)
    }
  })
}


export function saveBacktestReportsDataJson(strategyReport: StrategyReport): Promise<boolean> {
  return new Promise(async(resolve) => {
    let reports: StrategyReport[] = await readBacktestReportsJsonAndParse()
    reports = reports.filter(obj => obj.strategyName !== strategyReport.strategyName);
    reports.push(strategyReport);
    const filePath = `${yml.backtestReportsFilePath}`
    fs.writeFile(filePath, JSON.stringify(reports), (err: any) => {
      if (err) {
        console.log(colors.red(`\t Strategy report ${strategyReport.strategyName} saved FAILED with error => ${err}`))
        resolve(false)
      }
      console.log(colors.green(`\t Strategy report ${strategyReport.strategyName} saved!`))
      resolve(true)
    })
  })
}
