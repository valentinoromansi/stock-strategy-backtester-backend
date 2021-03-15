"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var stock_data_1 = require("../../src/model/price/stock-data");
var vertical_slice_1 = require("../../src/model/price/vertical-slice");
var strategy_rule_1 = require("../../src/backtester/model/strategy-rule");
var graph_entity_1 = require("../../src/backtester/model/graph-entity");
var graph_entity_type_1 = require("../../src/backtester/types/graph-entity-type");
var graph_position_type_1 = require("../../src/backtester/types/graph-position-type");
var pattern_conditions_1 = require("../../src/backtester/pattern-conditions");
/***********************
 * BULL_ENG_BELOW_BELOW
 ***********************/
test("blabla", function () { });
/*
test("isPatternValid must be true for valid engulfing pattern and price under sma", () => {
  let prices: PriceLinkedList = new PriceLinkedList()
  prices.append(new Price(new Date(), 0, 50, 0, 0))
  prices.append(new Price(new Date(), 1, 0.5, 0, 0))
  prices.append(new Price(new Date(), 0.5, 1.1, 0, 0))

  const isValid = isPatternValid(Pattern.BULL_ENG_BELOW_BELOW, prices.last)
  expect(isValid).toBe(true)
})

test("isPatternValid must be false for invalid engulfing pattern -> not engulfing", () => {
  let prices: PriceLinkedList = new PriceLinkedList()
  prices.append(new Price(new Date(), 0, 50, 0, 0))
  prices.append(new Price(new Date(), 1, 0.5, 0, 0))
  prices.append(new Price(new Date(), 0.5, 0.9, 0, 0))

  const isValid = isPatternValid(Pattern.BULL_ENG_BELOW_BELOW, prices.last)
  expect(isValid).toBe(false)
})

test("isPatternValid must be false for invalid engulfing pattern -> not under sma", () => {
  let prices: PriceLinkedList = new PriceLinkedList()
  prices.append(new Price(new Date(), 0, 50, 0, 0))
  prices.append(new Price(new Date(), 50, 49, 0, 0))
  prices.append(new Price(new Date(), 49, 100, 0, 0))

  const isValid = isPatternValid(Pattern.BULL_ENG_BELOW_BELOW, prices.last)
  expect(isValid).toBe(false)
})
*/
/*
 * {
    "entity1":
        "id": "0"
    "type": "LOW",
    "period": "null"
    "position": "EQUAL",
    "positionOffset": 10 // used as percentage
    "entity2":
        "id": "1"
    "type": "LOW",
    "period": "null"
}

graphEntity1: GraphEntity
  position: GraphPositionType
  positionOffset: number
  graphEntity2: GraphEntity
*/
test("areValuesWithOffsetEqual for GraphEntityType.LOW", function () {
    var prices = new stock_data_1.StockData();
    var price1 = prices.append(new vertical_slice_1.VerticalSlice(new Date(), 12, 11, 0, 9));
    var price2 = prices.append(new vertical_slice_1.VerticalSlice(new Date(), 0, 0, 0, 0));
    var rule = new strategy_rule_1.StrategyRule({
        graphEntity1: new graph_entity_1.GraphEntity({
            id: 0,
            type: graph_entity_type_1.GraphEntityType.LOW,
            period: null,
        }),
        position: graph_position_type_1.GraphPositionType.EQUAL,
        offsetPercentage: 10,
        graphEntity2: new graph_entity_1.GraphEntity({
            id: 1,
            type: graph_entity_type_1.GraphEntityType.LOW,
            period: null,
        }),
    });
    price2.low = 8.8;
    expect(pattern_conditions_1.areValuesWithinRangeEqual(price1, rule)).toBe(true);
    price2.low = 8.79;
    expect(pattern_conditions_1.areValuesWithinRangeEqual(price1, rule)).toBe(false);
    price2.low = 8.81;
    expect(pattern_conditions_1.areValuesWithinRangeEqual(price1, rule)).toBe(true);
    price2.low = 9.19;
    expect(pattern_conditions_1.areValuesWithinRangeEqual(price1, rule)).toBe(true);
    price2.low = 9.2;
    expect(pattern_conditions_1.areValuesWithinRangeEqual(price1, rule)).toBe(true);
    price2.low = 9.21;
    expect(pattern_conditions_1.areValuesWithinRangeEqual(price1, rule)).toBe(false);
});
test("areValuesWithOffsetEqual for GraphEntityType.HIGH", function () {
    var prices = new stock_data_1.StockData();
    var price1 = prices.append(new vertical_slice_1.VerticalSlice(new Date(), 12, 11, 14, 0));
    var price2 = prices.append(new vertical_slice_1.VerticalSlice(new Date(), 0, 0, 0, 0));
    var rule = new strategy_rule_1.StrategyRule({
        graphEntity1: new graph_entity_1.GraphEntity({
            id: 0,
            type: graph_entity_type_1.GraphEntityType.HIGH,
            period: null,
        }),
        position: graph_position_type_1.GraphPositionType.EQUAL,
        offsetPercentage: 10,
        graphEntity2: new graph_entity_1.GraphEntity({
            id: 1,
            type: graph_entity_type_1.GraphEntityType.HIGH,
            period: null,
        }),
    });
    price2.high = 13.79;
    expect(pattern_conditions_1.areValuesWithinRangeEqual(price1, rule)).toBe(false);
    price2.high = 13.8;
    expect(pattern_conditions_1.areValuesWithinRangeEqual(price1, rule)).toBe(true);
    price2.high = 13.81;
    expect(pattern_conditions_1.areValuesWithinRangeEqual(price1, rule)).toBe(true);
    price2.high = 14.19;
    expect(pattern_conditions_1.areValuesWithinRangeEqual(price1, rule)).toBe(true);
    price2.high = 14.2;
    expect(pattern_conditions_1.areValuesWithinRangeEqual(price1, rule)).toBe(true);
    price2.high = 14.21;
    expect(pattern_conditions_1.areValuesWithinRangeEqual(price1, rule)).toBe(false);
});
test("areValuesWithOffsetEqual for GraphEntityType.OPEN", function () {
    var prices = new stock_data_1.StockData();
    var price1 = prices.append(new vertical_slice_1.VerticalSlice(new Date(), 10, 11, 0, 0));
    var price2 = prices.append(new vertical_slice_1.VerticalSlice(new Date(), 0, 0, 0, 0));
    var rule = new strategy_rule_1.StrategyRule({
        graphEntity1: new graph_entity_1.GraphEntity({
            id: 0,
            type: graph_entity_type_1.GraphEntityType.OPEN,
            period: null,
        }),
        position: graph_position_type_1.GraphPositionType.EQUAL,
        offsetPercentage: 10,
        graphEntity2: new graph_entity_1.GraphEntity({
            id: 1,
            type: graph_entity_type_1.GraphEntityType.OPEN,
            period: null,
        }),
    });
    price2.open = 9.89;
    expect(pattern_conditions_1.areValuesWithinRangeEqual(price1, rule)).toBe(false);
    price2.open = 9.9;
    expect(pattern_conditions_1.areValuesWithinRangeEqual(price1, rule)).toBe(true);
    price2.open = 9.91;
    expect(pattern_conditions_1.areValuesWithinRangeEqual(price1, rule)).toBe(true);
    price2.open = 10.09;
    expect(pattern_conditions_1.areValuesWithinRangeEqual(price1, rule)).toBe(true);
    price2.open = 10.1;
    expect(pattern_conditions_1.areValuesWithinRangeEqual(price1, rule)).toBe(true);
    price2.open = 10.11;
    expect(pattern_conditions_1.areValuesWithinRangeEqual(price1, rule)).toBe(false);
});
test("areValuesWithOffsetEqual for GraphEntityType.CLOSE", function () {
    var prices = new stock_data_1.StockData();
    var price1 = prices.append(new vertical_slice_1.VerticalSlice(new Date(), 10, 11, 0, 0));
    var price2 = prices.append(new vertical_slice_1.VerticalSlice(new Date(), 0, 0, 0, 0));
    var rule = new strategy_rule_1.StrategyRule({
        graphEntity1: new graph_entity_1.GraphEntity({
            id: 0,
            type: graph_entity_type_1.GraphEntityType.CLOSE,
            period: null,
        }),
        position: graph_position_type_1.GraphPositionType.EQUAL,
        offsetPercentage: 10,
        graphEntity2: new graph_entity_1.GraphEntity({
            id: 1,
            type: graph_entity_type_1.GraphEntityType.CLOSE,
            period: null,
        }),
    });
    price2.close = 10.89;
    expect(pattern_conditions_1.areValuesWithinRangeEqual(price1, rule)).toBe(false);
    price2.close = 10.9;
    expect(pattern_conditions_1.areValuesWithinRangeEqual(price1, rule)).toBe(true);
    price2.close = 10.91;
    expect(pattern_conditions_1.areValuesWithinRangeEqual(price1, rule)).toBe(true);
    price2.close = 11.09;
    expect(pattern_conditions_1.areValuesWithinRangeEqual(price1, rule)).toBe(true);
    price2.close = 11.1;
    expect(pattern_conditions_1.areValuesWithinRangeEqual(price1, rule)).toBe(true);
    price2.close = 11.11;
    expect(pattern_conditions_1.areValuesWithinRangeEqual(price1, rule)).toBe(false);
});
