import { GraphEntity } from "./graph-entity"
import { StrategyRule } from "./strategy-rule"

export class Strategy {
	name: string  
	enterEntity: GraphEntity
	stopLossEntity: GraphEntity
	rules: StrategyRule[]
	exitTradeRule: StrategyRule // can be null if stop loss is pre defined

  constructor(init?: Partial<Strategy>) {
    Object.assign(this, init)
  }
}
