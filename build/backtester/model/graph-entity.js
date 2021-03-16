"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphEntity = void 0;
/**
 * 1.) only type1:
 *      - entity value is value of slice attribute[type1]
 * 2.) type1, type2, percent:
 *      - entity value is value of slice attributes[type1,type2] including percent
 */
var GraphEntity = /** @class */ (function () {
    function GraphEntity(init) {
        Object.assign(this, init);
    }
    /**
   * Takes 2 attributes values and gives back value between those 2 attribute values based on percent
   * For slice = new VerticalSlice(new Date(), 4, 14, 0, 0):
   *    - 9 for new GraphEntity({ type1: GraphEntityType.OPEN, type2: GraphEntityType.CLOSE, percent: 0.5 })
   *    - 4 for new GraphEntity({ type1: GraphEntityType.OPEN })
   * @param percent - values from -0.4 to 1.2 would mean -40% to 120%
   */
    GraphEntity.prototype.getValueRelativeToAttributes = function (slice) {
        if (this.type1 && !this.type2 && !this.percent) {
            return slice.getAttributeValue(this.type1);
        }
        else if (this.type1 && this.type2 && this.percent) {
            var lowerAttributeValue = Math.min(slice.getAttributeValue(this.type1), slice.getAttributeValue(this.type2));
            var attributesValueDistance = Math.abs(slice.getAttributeValue(this.type1) - slice.getAttributeValue(this.type2));
            return lowerAttributeValue + attributesValueDistance * this.percent;
        }
        else
            throw ('GraphEntity.getValueRelativeToAttributes thrown error');
    };
    return GraphEntity;
}());
exports.GraphEntity = GraphEntity;
