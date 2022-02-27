import { VerticalSlice } from "../stock/vertical-slice"
import { Direction } from "../types/direction"
import { ConditionalRule } from "../strategy/conditional-rule"
import { Position } from "../types/position"

/**
 * Takes vertical slice and checks if it satisfies all defined rules
 * 1.) true   - if all rules are satisfied
 * 2.) false  - if at least one rule is not satisfied 
 * 3.) null   - if it hasn't all necessary connected slices to even test the strategy 
 * @param slice - in 'strategyRules' it will be represented as GraphEntity with id=0
 * @param strategyRules
 */
export function isPatternValid(slice: VerticalSlice, strategyRules: ConditionalRule[]): boolean {
  const furthestSliceId = Math.max(...strategyRules.map((rule) => Math.max(rule.valueData1.id, rule.valueData2.id)))

  if (!slice.hasConnectedSlices(Direction.RIGHT, furthestSliceId)) return null

  for (let i = 0; i < strategyRules.length; ++i) {
    const rule = strategyRules[i]
    const val1 = slice.getConnectedSlice(Direction.RIGHT, rule.valueData1.id).getValueRelativeToAttributes(rule.valueData1)
    const val2 = slice.getConnectedSlice(Direction.RIGHT, rule.valueData2.id).getValueRelativeToAttributes(rule.valueData2)
    // check if rule is valid
    if (rule.position == Position.ABOVE && val1 < val2) return false
    if (rule.position == Position.BELOW && val1 > val2) return false
  }
  return true
}
