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
  return new Promise((resolve) => {
    const filePath = `${yml.strategiesFilePath}`
    if (!fs.existsSync(filePath)) {
      console.log(colors.red(`File ${yml.strategiesFilePath} does not exist!`))
      resolve([])
    } else {
      let json = fs.readFileSync(`${yml.strategiesFilePath}`, {
        encoding: "utf8",
      })
      let strategies: Strategy[] = []
      try {
        let strategiesJsonObj: [] = JSON.parse(json)
        strategiesJsonObj.forEach((strategyJsonObj) => {
          strategies.push(Strategy.copy(strategyJsonObj))
        })
      } catch (e) {
        console.log(
          colors.red(`readStrategiesJsonAndParse -> Parsing ${yml.strategiesFilePath} json failed! Exception: ${e}`)
        )
        resolve([])
      }
      resolve(strategies)
    }
  })
}

export function saveStrategyJson(strategy: Strategy): Promise<boolean> {
  return new Promise(async (resolve) => {
    let strategies: Strategy[] = await readStrategiesJsonAndParse()
    strategies = strategies.filter((obj) => obj.name !== strategy.name)
    strategies.push(strategy)
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

export function deleteStrategy(strategyName: string): Promise<boolean> {
  return new Promise(async (resolve) => {
    let strategies: Strategy[] = await readStrategiesJsonAndParse()
    strategies = strategies.filter((obj) => obj.name !== strategyName)
    const filePath = `${yml.strategiesFilePath}`
    fs.writeFile(filePath, JSON.stringify(strategies), (err: any) => {
      if (err) {
        console.log(colors.red(`\t Strategy ${strategyName} saved FAILED with error => ${err}`))
        resolve(false)
      }
      console.log(colors.green(`\t Strategy ${strategyName} saved!`))
      resolve(true)
    })
  })
}

export async function readStrategyReportsJsonAndParse(): Promise<StrategyReport[]> {
  return new Promise((resolve) => {
    const filePath = `${yml.strategyReportsFilePath}`
    if (!fs.existsSync(filePath)) {
      console.log(colors.red(`File ${yml.strategyReportsFilePath} does not exist!`))
      resolve([])
    } else {
      let json = fs.readFileSync(`${yml.strategyReportsFilePath}`, {
        encoding: "utf8",
      })
      let reports: StrategyReport[] = []
      try {
        let reportsPropsOnly: [] = JSON.parse(json)
        reportsPropsOnly.forEach((reportPropsOnly) => {
          var report: StrategyReport = Object.create(StrategyReport.prototype)
          Object.assign(report, reportPropsOnly)
          reports.push(report)
        })
      } catch (e) {
        console.log(
          colors.red(`readBacktestReportsJsonAndParse -> Parsing ${yml.strategyReportsFilePath} json failed!`)
        )
        resolve([])
      }
      resolve(reports)
    }
  })
}

export function saveStrategyReportsJson(newReports: StrategyReport[]): Promise<boolean> {
  return new Promise(async (resolve) => {
    let reportsToSave: StrategyReport[] = await readStrategyReportsJsonAndParse()
    // Remove already existing reports so new versions can ba added
    newReports.forEach((rep) => {
      reportsToSave = reportsToSave.filter((obj) => obj.strategyName !== rep.strategyName)
    })
    // Add new reports
    newReports.forEach((rep) => {
      reportsToSave.push(rep)
    })
    const filePath = `${yml.strategyReportsFilePath}`
    fs.writeFile(filePath, JSON.stringify(reportsToSave), (err: any) => {
      if (err) {
        console.log(
          colors.red(
            `\t Strategy reports ${newReports.map((rep) => rep.strategyName)} saved FAILED with error => ${err}`
          )
        )
        resolve(false)
      }
      console.log(colors.green(`\t Strategy reports ${newReports.map((rep) => rep.strategyName)} saved!`))
      resolve(true)
    })
  })
}
