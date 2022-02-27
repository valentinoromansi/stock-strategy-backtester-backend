import { ValueExtractionRule } from "./value-extraction-rule"
import { Position } from "../types/position"

/*
* Defines relation between attribute values from 2 different slices
* Example 1:
  {
	"relativeAttributeData1":
		"id": 0,
		"type1": AttributeType.CLOSE,
	"position": Position.BELOW,
	"relativeAttributeData2":
		"id": "2",
		"type2": "EMA9",
}
  - Rule checks if value CLOSE of slice moved by 0 from given slice is BELOW value of clice EMA9 moved by 2 from given slice
*/
export class ConditionalRule {
  valueData1: ValueExtractionRule
  position: Position
  valueData2: ValueExtractionRule

  constructor(init?: Partial<ConditionalRule>) {
    Object.assign(this, init)
  }

  static copy(strategyRule: ConditionalRule): ConditionalRule {
    return new ConditionalRule({
      valueData1: ValueExtractionRule.copy(strategyRule.valueData1),
      position: strategyRule.position,
      valueData2: ValueExtractionRule.copy(strategyRule.valueData2),
    })
  }

  description(): string {
    return `${this.valueData1.description()} ${this.position} ${this.valueData2.description()}`
  }
}
