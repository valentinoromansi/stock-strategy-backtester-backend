import { Strategy } from "../strategy/strategy"

export interface RequestGetStock {
    body: {
      symbol: string,
      interval: string
    }
  }

export interface RequestSaveStrategy {
  body: Strategy
}

export interface RequestDeleteStrategy {
  body: {
    name: string
  }
}

export interface RequestUpdateStrategyReports {
  body: {
    strategyName?: string
  }
}

