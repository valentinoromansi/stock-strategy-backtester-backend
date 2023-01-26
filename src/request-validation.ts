import colors from "colors"
import { RequestDeleteStrategy, RequestGetStock, RequestSaveStrategy } from "./types/service-request"
import { ServiceResponse } from "./types/service-response"

export function validateGetStockRequest(req: RequestGetStock, res: any, next: any) {
    const { interval, symbol } = req.body
    const allowedIntervals = ["15min", "1h", "1day"] 
    let serviceRes: ServiceResponse
    if(!allowedIntervals.includes(interval))
      serviceRes = new ServiceResponse({message: `Interval '${interval}' is not a valid value. Allowed intervals are: [${allowedIntervals}]!`})
    if(!symbol)
      serviceRes = new ServiceResponse({message: `Symbol must be defined!`})
    if(serviceRes) {
      console.log(colors.red(`Validation for /get-stock failed with message='${serviceRes.message}'`))
      serviceRes.status = 400
      return res.send(serviceRes)
    }
    next()
  }

export function validateSaveStrategyRequest(req: RequestSaveStrategy, res: any, next: any) {
    const { name, enterValueExRule: enterRule, stopLossValueExRule: exitRule, riskToRewardList, strategyConRules } = req.body
    var Filter = require('bad-words')
    let serviceRes: ServiceResponse
    if(!name)
      serviceRes = new ServiceResponse({ message: `Name must be defined!` })
    else if(name !== new Filter().clean(name)) {
      serviceRes = new ServiceResponse({ message: 'Strategy name contains profanities and could not be saved!' })
    }
    else if(!enterRule.isRelative && (enterRule.id < 0 || !enterRule.attribute1))
      serviceRes = new ServiceResponse({ message: `Property 'enterValueExRule' defined as non relative but is in invalid format!` })
    else if(enterRule.isRelative && (enterRule.id < 0 || !enterRule.attribute1 || !enterRule.attribute2 || !enterRule.percent))
      serviceRes = new ServiceResponse({ message: `Property 'enterValueExRule' defined as relative but is in invalid format!` })
    else if(!exitRule.isRelative && (exitRule.id < 0 || !exitRule.attribute1))
      serviceRes = new ServiceResponse({ message: `Property 'exitRule' defined as non relative but is in invalid format!` })
    else if(exitRule.isRelative && (exitRule.id < 0 || !exitRule.attribute1 || !exitRule.attribute2 || !exitRule.percent))
      serviceRes = new ServiceResponse({ message: `Property 'exitRule' defined as relative but is in invalid format!` })
    else if(strategyConRules?.length < 2)
      serviceRes = new ServiceResponse({ message: `There must be at least 2 rules defined!` })  
    if(serviceRes) {
      console.log(colors.red(`Validation for /save-strategy failed with message='${serviceRes.message}'`))
      serviceRes.status = 400
      return res.send(serviceRes)
    }
    next()
  }

export function validateDeleteStrategyRequest(req: RequestDeleteStrategy, res: any, next: any) {
    const { name } = req.body
    let serviceRes: ServiceResponse
    if(!name)
      serviceRes = new ServiceResponse({ message: `Strategy name must be defined!` })   
    if(serviceRes) {
      console.log(colors.red(`Validation for /delete-strategy failed with message='${serviceRes.message}'`))
      serviceRes.status = 400
      return res.send(serviceRes)
    }
    next()
  }