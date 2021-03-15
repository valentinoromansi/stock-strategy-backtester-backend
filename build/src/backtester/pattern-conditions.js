"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPatternValid = exports.areValuesWithinRangeEqual = exports.getEntityValue = void 0;
var indicator_calculation_1 = require("./indicator-calculation");
var direction_1 = require("../model/price/direction");
var graph_entity_type_1 = require("./types/graph-entity-type");
var graph_position_type_1 = require("./types/graph-position-type");
/**
 *
 * @param price
 * @param entityType
 * @param indicatorCalcValue => Value that indicator usses for calculation of value => 9 in EMA9, SMA9 or N value of previous prices in RSI
 */
function getEntityValue(price, entityType, indicatorCalcValue) {
    if (indicatorCalcValue === void 0) { indicatorCalcValue = null; }
    switch (entityType) {
        case graph_entity_type_1.GraphEntityType.OPEN:
            return price.open;
        case graph_entity_type_1.GraphEntityType.CLOSE:
            return price.close;
        case graph_entity_type_1.GraphEntityType.HIGH:
            return price.high;
        case graph_entity_type_1.GraphEntityType.LOW:
            return price.low;
        case graph_entity_type_1.GraphEntityType.SMA:
            return indicator_calculation_1.smaValue(indicatorCalcValue, price);
        case graph_entity_type_1.GraphEntityType.EMA:
            return indicator_calculation_1.emaValue(indicatorCalcValue, price);
        case graph_entity_type_1.GraphEntityType.RSI:
            return indicator_calculation_1.rsiValue(indicatorCalcValue, price);
        default:
            return 0;
    }
}
exports.getEntityValue = getEntityValue;
function isTypePrice(entityType) {
    return [graph_entity_type_1.GraphEntityType.OPEN, graph_entity_type_1.GraphEntityType.CLOSE, graph_entity_type_1.GraphEntityType.HIGH, graph_entity_type_1.GraphEntityType.LOW].includes(entityType);
}
function getComparisonValue(price, entity) {
    // if it's price value
    if (isTypePrice(entity.type)) {
        var priceForEntity = price.getConnectedPrice(direction_1.Direction.RIGHT, entity.id);
        return getEntityValue(priceForEntity, entity.type);
    }
    // if it's indicator value
    else {
        var priceForEntity = price.getConnectedPrice(direction_1.Direction.RIGHT, entity.id);
        return getEntityValue(priceForEntity, entity.type, entity.period);
    }
}
// Used only for when entityType1 is OPEN, CLOSE, HIGH, LOW
function areValuesWithinRangeEqual(price, rule) {
    var price1 = price.getConnectedPrice(direction_1.Direction.RIGHT, rule.graphEntity1.id);
    if (!isTypePrice(rule.graphEntity1.type) && price1 && price1 != price)
        return false;
    // Get offset
    var offset = 0;
    var tryCalculateOffset = function (enToEnGraphTypes, enToEnHeight) {
        offset = enToEnGraphTypes.includes(rule.graphEntity1.type) ? enToEnHeight * (rule.offsetPercentage / 100) : offset;
    };
    tryCalculateOffset([graph_entity_type_1.GraphEntityType.OPEN, graph_entity_type_1.GraphEntityType.CLOSE], Math.abs(price1.open - price1.close));
    tryCalculateOffset([graph_entity_type_1.GraphEntityType.HIGH], price1.high - (price1.close > price1.open ? price1.close : price1.open));
    tryCalculateOffset([graph_entity_type_1.GraphEntityType.LOW], (price1.close < price1.open ? price1.close : price1.open) - price1.low);
    var val1 = getComparisonValue(price, rule.graphEntity1);
    var val2 = getComparisonValue(price, rule.graphEntity2);
    return val2 >= val1 - offset && val2 <= val1 + offset;
}
exports.areValuesWithinRangeEqual = areValuesWithinRangeEqual;
/**
 * Takes single price and checks if it satisfies all defined rules
 * @param price
 * @param strategyRules
 */
function isPatternValid(price, strategyRules) {
    var biggestId = Math.max.apply(Math, strategyRules.map(function (rule) { return Math.max(rule.graphEntity1.id, rule.graphEntity2.id); }));
    if (!price.hasConnectedPrices(direction_1.Direction.RIGHT, biggestId))
        return false;
    var priceEnums = [graph_entity_type_1.GraphEntityType.OPEN, graph_entity_type_1.GraphEntityType.CLOSE, graph_entity_type_1.GraphEntityType.HIGH, graph_entity_type_1.GraphEntityType.LOW];
    for (var i = 0; i < strategyRules.length; ++i) {
        var rule = strategyRules[i];
        var val1 = getComparisonValue(price, rule.graphEntity1);
        var val2 = getComparisonValue(price, rule.graphEntity2);
        // check if rule is valid
        if (rule.position == graph_position_type_1.GraphPositionType.ABOVE && val1 > val2)
            return true;
        if (rule.position == graph_position_type_1.GraphPositionType.BELOW && val1 < val2)
            return true;
        if (rule.position == graph_position_type_1.GraphPositionType.EQUAL && areValuesWithinRangeEqual(price, rule))
            return true;
    }
    return false;
}
exports.isPatternValid = isPatternValid;
