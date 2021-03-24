import { AttributeType } from "../types/attribute-type"

export enum RelativeAttributeValueSource {
  TYPE1,
  TYPE1_TYPE2
}

/**
 * Represents abstract definition of some connected slice attribute value(relative to given slice and id)
 * 1.) only type1: 
 *      - objects value is value of slice attribute[type1]
 * 2.) type1, type2, percent:
 *      - objects value is value of slice attributes[type1,type2] including percent
 * 
 * Example 1:
 *   RelativeAttributeData {
      id: 1
      type1: AttributeType.OPEN
      type2: null
      percent: null
      period: null
    }
  - Value = value of attribute='open' of slice moved from given slice by 1
* Example 2:
 *   RelativeAttributeData {
      id: 1
      type1: AttributeType.OPEN
      type2: AttributeType.CLOSE
      percent: 0.5
      period: null
    }
  - Value = value at 50% between attributes 'open' and 'close' of slice moved from given slice by 1
 * 
 */ 
export class RelativeAttributeValueData {
  id: number
  type1: AttributeType
  type2: AttributeType
  percent: number
  period: number // used only for indicators(EMA9 -> period = 9)

  constructor(init?: Partial<RelativeAttributeValueData>) {
    Object.assign(this, init)
  }

  static copy(relativeAttributeValueData: RelativeAttributeValueData): RelativeAttributeValueData {
    return new RelativeAttributeValueData({
      id: relativeAttributeValueData.id,
      type1: relativeAttributeValueData.type1,
      type2: relativeAttributeValueData.type2,
      percent: relativeAttributeValueData.percent,
      period: relativeAttributeValueData.period
    })
  }

  getRelativeAttributeValueSource() : RelativeAttributeValueSource {
    if(this.type1 && !this.type2 && !this.percent)
      return RelativeAttributeValueSource.TYPE1
    else if(this.type1 && this.type2 && this.percent)
      return RelativeAttributeValueSource.TYPE1_TYPE2
    else
      throw('RelativeAttributeData.getRelativeAttributeValueSource thrown error')
  }

  description(): string {
    let source = this.getRelativeAttributeValueSource()
    switch(source) {
      case RelativeAttributeValueSource.TYPE1: 
        return ('slice[' + this.id + '].' + this.type1)
      case RelativeAttributeValueSource.TYPE1_TYPE2: 
        return ('slice[' + this.id + '].(' + this.percent * 100 + '% of ' + this.type1 + '-' + this.type2 + ')')
      default:
        return 'RelativeAttributeValueData description could not be described'
    }
  }

}
