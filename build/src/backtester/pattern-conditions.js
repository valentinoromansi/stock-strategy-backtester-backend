"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPatternValid = void 0;
var pattern_type_1 = require("./pattern-type");
var price_1 = require("../model/price/price");
var indicator_calculation_1 = require("./indicator-calculation");
var direction_1 = require("../model/price/direction");
var patternTypeFuncMap = new Map();
patternTypeFuncMap.set(pattern_type_1.Pattern.BULL_ENG_BELOW_BELOW, function (price) {
    var ema = indicator_calculation_1.emaValue(9, price);
    if (ema == 0 || !price.hasConnectedPrices(direction_1.Direction.LEFT, 1))
        return false;
    var isPriceEngulfingPrevious = price.close > price.prev.open;
    var arePricesBelowEma = [price.open, price.close, price.prev.open, price.prev.close].every(function (p) { return p < ema; });
    return isPriceEngulfingPrevious && arePricesBelowEma;
});
patternTypeFuncMap.set(pattern_type_1.Pattern.BULL_ENG_THROUGH_THROUGH, function (price) {
    console.log("BULL_ENG_THROUGH_THROUGH");
    return false;
});
function isPatternValid(pattern, price) {
    var _a;
    var isValid = (_a = patternTypeFuncMap.get(pattern)) === null || _a === void 0 ? void 0 : _a.call(null, price);
    return !isValid ? false : isValid;
}
exports.isPatternValid = isPatternValid;
var price = new price_1.Price(new Date(), 0, 0, 0, 0);
console.log(isPatternValid(pattern_type_1.Pattern.BULL_ENG_BELOW_BELOW, price));
