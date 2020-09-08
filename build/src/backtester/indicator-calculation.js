"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emaValue = void 0;
var direction_1 = require("../model/price/direction");
// Since ema calculation is including current price last one(period - 1) must be excluded
function emaValue(emaPeriod, price) {
    if (!price.hasConnectedPrices(direction_1.Direction.LEFT, emaPeriod - 1) || emaPeriod <= 0)
        return 0;
    var ema = 0;
    price.executeEachIteration(direction_1.Direction.LEFT, emaPeriod - 1, function (price) {
        ema += price.close;
    });
    return ema / emaPeriod;
}
exports.emaValue = emaValue;
