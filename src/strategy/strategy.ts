import { ValueExtractionRule } from "./value-extraction-rule"
import { ConditionalRule } from "./conditional-rule"

/**
 * Strategy defines rules for:
 *    1. entering trade - @enterValueExRule
 *    2. exiting trade  - @stopLossValueExRule or @exitTradeCondRule
 *    3. strategy validity - @strategyConRules
 * There must be @riskToRewardList or @exitTradeCondRule defined but never both since combination of @enterValueExRule , @stopLossValueExRule and @riskToRewardList gives info when trade should be exited.
 * @enterValueExRule    - rule for when trade should be entered
 * @stopLossValueExRule - rule for when trade should end when hit loss is hit
 * @strategyConRules    - list of rules between 2 slices that must be respected for strategy to be valid
 * @exitTradeCondRule   - rule for when trade should be exited
 * @riskToRewardList    - list of risk to reward values that determines what will be the values of stop loss and exit
 */
export class Strategy {
  name: string
  enterValueExRule: ValueExtractionRule
  stopLossValueExRule: ValueExtractionRule
  strategyConRules: ConditionalRule[]
  exitTradeCondRule: ConditionalRule
  riskToRewardList: number[]

  constructor(init?: Partial<Strategy>) {
    Object.assign(this, init)
  }

  static copy(strategy: Strategy): Strategy {
    return new Strategy({
      name: strategy.name,
      enterValueExRule: strategy.enterValueExRule ? ValueExtractionRule.copy(strategy.enterValueExRule) : null,
      stopLossValueExRule: strategy.stopLossValueExRule ? ValueExtractionRule.copy(strategy.stopLossValueExRule) : null,
      riskToRewardList: strategy.riskToRewardList,
      strategyConRules: strategy.strategyConRules
        ? strategy.strategyConRules.map((rule) => ConditionalRule.copy(rule))
        : null,
      exitTradeCondRule: strategy.exitTradeCondRule ? ConditionalRule.copy(strategy.exitTradeCondRule) : null,
    })
  }

  description(): string {
    return `enter: ${this.enterValueExRule?.description()}\n 
            stop loss: ${this.stopLossValueExRule?.description()}\n 
            rules: ${this.strategyConRules?.map((rule) => "\n\t" + rule.description())}\n 
            exit trade rule: : ${this.exitTradeCondRule?.description()}\n`
  }
}
