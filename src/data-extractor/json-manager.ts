import { Stock } from "../stock/stock-data"
import { VerticalSlice } from "../stock/vertical-slice"
import { Strategy } from "../strategy/strategy"
import { yml } from "../yml/yml"
import colors from "colors"

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
      console.log(colors.red(`File ${yml.strategiesFilePath} could not be read!`))
      resolve(null)
    }
    else {
      let json = fs.readFileSync(`${yml.strategiesFilePath}`, {
        encoding: "utf8",
      })
      let strategies: Strategy[] = JSON.parse(json)
      resolve(strategies)
    }
  })
}

// ! Validate json as Strategy object before saving
export function saveStrategyJson(strategy: Strategy): Promise<any> {
  return new Promise((resolve) => {
    const filePath = `${yml.strategiesFilePath}`
    if (!fs.existsSync(filePath)) {
      fs.writeFile(filePath, JSON.stringify([strategy]), (err: any) => {
        if (err) throw err
        console.log(colors.green(`\t Strategy ${strategy.name} saved!`))
        resolve(true)
      })
    }
    else {
      let json = fs.readFileSync(`${yml.strategiesFilePath}`, {
        encoding: "utf8",
      })
      let strategies: Strategy[] = JSON.parse(json)
      strategies = strategies.filter(obj => obj.name !== strategy.name);
      strategies.push(strategy);
      fs.writeFile(filePath, JSON.stringify(strategies), (err: any) => {
        if (err) throw err
        console.log(colors.green(`\t Strategy ${strategy.name} saved!`))
        resolve(true)
      })
    }
  })
}
