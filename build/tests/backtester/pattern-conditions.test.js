"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var price_linked_list_1 = require("../../src/model/price/price-linked-list");
var price_1 = require("../../src/model/price/price");
var pattern_conditions_1 = require("../../src/backtester/pattern-conditions");
var pattern_type_1 = require("../../src/backtester/pattern-type");
test("emaValue must properly calculate ema value", function () {
    var prices = new price_linked_list_1.PriceLinkedList();
    prices.append(new price_1.Price(new Date(), 0, 20, 0, 0));
    prices.append(new price_1.Price(new Date(), 20, 19, 0, 0));
    prices.append(new price_1.Price(new Date(), 19, 18, 0, 0));
    prices.append(new price_1.Price(new Date(), 18, 17, 0, 0));
    var isBelowEma = pattern_conditions_1.isPatternValid(pattern_type_1.Pattern.BULL_ENG_BELOW_BELOW, prices.last);
    expect(isBelowEma).toBe(true);
});
