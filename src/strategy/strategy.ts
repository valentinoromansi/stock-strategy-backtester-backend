import { RelativeSliceValueExtractionRule } from "./relative-attribute-data"
import { StrategyRule } from "./strategy-rule"

export class Strategy {
  name: string
  enterRad: RelativeSliceValueExtractionRule
  stopLossRad: RelativeSliceValueExtractionRule // can be null if exitTradeRule is defined
  rules: StrategyRule[]
  exitTradeRule: StrategyRule // can be null if stop loss is pre defined
  riskToRewardList: number[]

  constructor(init?: Partial<Strategy>) {
    Object.assign(this, init)
  }

  static copy(strategy: Strategy): Strategy {
    return new Strategy({
      name: strategy.name,
      enterRad: strategy.enterRad ? RelativeSliceValueExtractionRule.copy(strategy.enterRad) : null,
      stopLossRad: strategy.stopLossRad ? RelativeSliceValueExtractionRule.copy(strategy.stopLossRad) : null,
      riskToRewardList: strategy.riskToRewardList,
      rules: strategy.rules ? strategy.rules.map((rule) => StrategyRule.copy(rule)) : null,
      exitTradeRule: strategy.exitTradeRule ? StrategyRule.copy(strategy.exitTradeRule) : null,
    })
  }

  description(): string {
    return (
      "enter: " +
      this.enterRad?.description() +
      "\n" +
      "stop loss: " +
      this.stopLossRad?.description() +
      "\n" +
      "rules: " +
      this.rules?.map((rule) => "\n\t" + rule.description()) +
      "\n" +
      "exit trade rule: " +
      this.exitTradeRule?.description() +
      "\n"
    )
  }
}
