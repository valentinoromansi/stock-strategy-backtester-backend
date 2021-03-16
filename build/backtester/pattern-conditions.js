"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPatternValid = void 0;
var direction_1 = require("../model/price/direction");
var graph_position_type_1 = require("./types/graph-position-type");
/**
 * Takes vertical slice and checks if it satisfies all defined rules
 * 1.) true   - if all rules are satisfied
 * 2.) false  - if at least one rule is not satisfied
 * 3.) null   - if it hasn't all necessary connected slices to even test the strategy
 * @param slice - in 'strategyRules' it will be represented as GraphEntity with id=0
 * @param strategyRules
 */
function isPatternValid(slice, strategyRules) {
    var furthestSliceId = Math.max.apply(Math, strategyRules.map(function (rule) { return Math.max(rule.graphEntity1.id, rule.graphEntity2.id); }));
    if (!slice.hasConnectedPrices(direction_1.Direction.RIGHT, furthestSliceId))
        return null;
    for (var i = 0; i < strategyRules.length; ++i) {
        var rule = strategyRules[i];
        var val1 = rule.graphEntity1.getValueRelativeToAttributes(slice.getConnectedPrice(direction_1.Direction.RIGHT, rule.graphEntity1.id));
        var val2 = rule.graphEntity2.getValueRelativeToAttributes(slice.getConnectedPrice(direction_1.Direction.RIGHT, rule.graphEntity2.id));
        // check if rule is valid
        if (rule.position == graph_position_type_1.GraphPositionType.ABOVE && val1 < val2)
            return false;
        if (rule.position == graph_position_type_1.GraphPositionType.BELOW && val1 > val2)
            return false;
    }
    return true;
}
exports.isPatternValid = isPatternValid;
