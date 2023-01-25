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

