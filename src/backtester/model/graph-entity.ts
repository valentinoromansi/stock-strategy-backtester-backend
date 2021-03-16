import { VerticalSlice } from "../../model/price/vertical-slice"
import { GraphEntityType } from "../types/graph-entity-type"

/**
 * 1.) only type1: 
 *      - entity value is value of slice attribute[type1]
 * 2.) type1, type2, percent:
 *      - entity value is value of slice attributes[type1,type2] including percent
 */ 
export class GraphEntity {
  id: number
  type1: GraphEntityType
  type2: GraphEntityType
  percent: number
  period: number // used only for indicators(EMA9 -> period = 9)

  constructor(init?: Partial<GraphEntity>) {
    Object.assign(this, init)
  }

    /**
   * Takes 2 attributes values and gives back value between those 2 attribute values based on percent
   * For slice = new VerticalSlice(new Date(), 4, 14, 0, 0):
   *    - 9 for new GraphEntity({ type1: GraphEntityType.OPEN, type2: GraphEntityType.CLOSE, percent: 0.5 })
   *    - 4 for new GraphEntity({ type1: GraphEntityType.OPEN })
   * @param percent - values from -0.4 to 1.2 would mean -40% to 120%
   */
    getValueRelativeToAttributes(slice: VerticalSlice): number {
      if(this.type1 && !this.type2 && !this.percent) {
        return slice.getAttributeValue(this.type1)
      }
      else if(this.type1 && this.type2 && this.percent) {
        let lowerAttributeValue = Math.min(slice.getAttributeValue(this.type1), slice.getAttributeValue(this.type2))
        let attributesValueDistance = Math.abs(slice.getAttributeValue(this.type1) - slice.getAttributeValue(this.type2))
        return lowerAttributeValue + attributesValueDistance * this.percent
      }
      else
        throw('GraphEntity.getValueRelativeToAttributes thrown error')
    }

}
