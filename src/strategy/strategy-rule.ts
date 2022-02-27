import { RelativeSliceValueExtractionRule } from "./relative-attribute-data"
import { Position } from "../types/position"

/*
 * Defines relation between attribute values from 2 different slices 
id defines entity moved from current price => entity[0] would be current entity, entity[2] would me 2 entities away form current entity
{
	"relativeAttributeData1":
		"id": 0
		"type1": AttributeType.CLOSE,
	"position": Position.BELOW,
	"relativeAttributeData2":
		"id": "0",
		"type2": "EMA9",
}
*/
export class StrategyRule {
  valueData1: RelativeSliceValueExtractionRule
  position: Position
  valueData2: RelativeSliceValueExtractionRule

  constructor(init?: Partial<StrategyRule>) {
    Object.assign(this, init)
  }

  static copy(strategyRule: StrategyRule): StrategyRule {
    return new StrategyRule({
		  valueData1: RelativeSliceValueExtractionRule.copy(strategyRule.valueData1),
		  position: strategyRule.position,
		  valueData2: RelativeSliceValueExtractionRule.copy(strategyRule.valueData2),
    })
  }

  description(): string {
    return (
      this.valueData1.description() + ' ' + this.position + ' ' + this.valueData2.description()
    )
  }

}
