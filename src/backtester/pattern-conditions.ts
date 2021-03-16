import { VerticalSlice } from "../model/price/vertical-slice"
import { smaValue, emaValue, rsiValue } from "./indicator-calculation"
import { Direction } from "../model/price/direction"
import { IndicatorType } from "./types/indicator-type"
import { IndicatorList, Indicator } from "./indicator-list"
import { GraphEntityType } from "./types/graph-entity-type"
import { StrategyRule } from "./model/strategy-rule"
import { GraphPositionType } from "./types/graph-position-type"
import { GraphEntity } from "./model/graph-entity"

/**
 * Takes vertical slice and checks if it satisfies all defined rules
 * 1.) true   - if all rules are satisfied
 * 2.) false  - if at least one rule is not satisfied 
 * 3.) null   - if it hasn't all necessary connected slices to even test the strategy 
 * @param slice - in 'strategyRules' it will be represented as GraphEntity with id=0
 * @param strategyRules
 */
export function isPatternValid(slice: VerticalSlice, strategyRules: StrategyRule[]): boolean {
  const furthestSliceId = Math.max(...strategyRules.map((rule) => Math.max(rule.graphEntity1.id, rule.graphEntity2.id)))

  if (!slice.hasConnectedPrices(Direction.RIGHT, furthestSliceId)) return null

  for (let i = 0; i < strategyRules.length; ++i) {
    const rule = strategyRules[i]
    const val1 = rule.graphEntity1.getValueRelativeToAttributes(slice.getConnectedPrice(Direction.RIGHT, rule.graphEntity1.id))
    const val2 = rule.graphEntity2.getValueRelativeToAttributes(slice.getConnectedPrice(Direction.RIGHT, rule.graphEntity2.id))
    // check if rule is valid
    if (rule.position == GraphPositionType.ABOVE && val1 < val2) return false
    if (rule.position == GraphPositionType.BELOW && val1 > val2) return false
  }
  return true
}
