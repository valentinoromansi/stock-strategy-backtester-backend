import { yml } from "../yml/yml"
import { StrategyVisual } from "../model/visuals/strategy-visual"

export function getStrategies(): {
  groupName: string
  name: string
  description: string[]
  visuals: StrategyVisual[]
}[] {
  return yml.strategies
}
