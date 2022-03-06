import { VerticalSlice } from "../stock/vertical-slice"
import { Direction } from "../types/direction"
import { ConditionalRule } from "../strategy/conditional-rule"
import { Position } from "../types/position"

/**
 * Takes vertical slice and checks if it satisfies all defined rules
 * 1.) true   - if all rules are satisfied
 * 2.) false  - if at least one rule is not satisfied or if it hasn't all necessary connected slices to even test the strategy
 * @param slice - in 'strategyRules' it will be represented as GraphEntity with id=0
 * @param rules
 */
export function isPatternValid(slice: VerticalSlice, rules: ConditionalRule[]): boolean {
  const furthestSliceId = rules.reduce((max, rule) => {
    return Math.max(max, rule.valueExtractionRule1.id, rule.valueExtractionRule2.id)
  }, 0)

  if (!slice.hasConnectedSlices(Direction.RIGHT, furthestSliceId)) return false

  for (let i = 0; i < rules.length; ++i) {
    const rule = rules[i]
    const val1 = slice
      .getConnectedSlice(Direction.RIGHT, rule.valueExtractionRule1.id)
      .getValueRelativeToAttributes(rule.valueExtractionRule1)
    const val2 = slice
      .getConnectedSlice(Direction.RIGHT, rule.valueExtractionRule2.id)
      .getValueRelativeToAttributes(rule.valueExtractionRule2)
    // check if rule is valid
    if (rule.position == Position.ABOVE && val1 < val2) return false
    if (rule.position == Position.BELOW && val1 > val2) return false
  }
  return true
}
