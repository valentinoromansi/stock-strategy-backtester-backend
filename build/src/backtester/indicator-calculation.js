"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rsiValue = exports.emaValue = exports.smaValue = void 0;
var direction_1 = require("../model/price/direction");
// Since ema calculation is including current price last one(period - 1) must be excluded
function smaValue(smaPeriod, price) {
    if (!price.hasConnectedPrices(direction_1.Direction.LEFT, smaPeriod - 1) || smaPeriod <= 0)
        return null;
    var sma = 0;
    price.executeEachIteration(direction_1.Direction.LEFT, smaPeriod - 1, function (price) {
        sma += price.close;
    });
    return sma / smaPeriod;
}
exports.smaValue = smaValue;
/* EMA: {Close - EMA(previous day)} x multiplier + EMA(previous day)
 * For EMAX, X*2-1 prices are needed
 * 1th to (x - 1)th prices are used to calculate SMA for (x - 1)th price
 * Xth to (x + 2)th prices are used to calculate EMA
 * For EMA4, prices from previous 7 days are needed
 */
function emaValue(emaPeriod, price) {
    if (!price.hasConnectedPrices(direction_1.Direction.LEFT, emaPeriod * 2 - 4) || emaPeriod <= 0)
        return null;
    var sma = smaValue(emaPeriod, price.getConnectedPrice(direction_1.Direction.LEFT, emaPeriod - 1));
    var multiplier = 2 / (emaPeriod + 1);
    var k = 2 / (emaPeriod + 1);
    var ema = 0;
    for (var i = 1; i < emaPeriod; i++) {
        var prevEmaValue = i == 1 ? sma : ema;
        var currentPrice = price.getConnectedPrice(direction_1.Direction.LEFT, emaPeriod - 1 - i).close;
        ema = (currentPrice - prevEmaValue) * multiplier + prevEmaValue;
        //console.log(`(${currentPrice} - ${prevEmaValue}) * ${multiplier} + ${prevEmaValue} = ` + ema)
    }
    return ema;
}
exports.emaValue = emaValue;
// THIS SHIT NEEDS TO BE TESTED
function rsiValue(rsiPeriod, price) {
    if (!price.hasConnectedPrices(direction_1.Direction.LEFT, rsiPeriod) || rsiPeriod <= 0)
        return null;
    var gainSum = 0;
    var lossSum = 0;
    price.executeEachIteration(direction_1.Direction.LEFT, rsiPeriod - 1, function (price) {
        var prevPrice = price.getConnectedPrice(direction_1.Direction.LEFT, 1);
        if (price.close > prevPrice.close)
            gainSum += price.close - prevPrice.close;
        if (price.close < prevPrice.close)
            lossSum += prevPrice.close - price.close;
        console.log(gainSum + " " + lossSum);
    });
    var rs = gainSum / rsiPeriod / (lossSum / rsiPeriod);
    console.log(rs);
    return 100 - 100 / (1 + rs);
}
exports.rsiValue = rsiValue;
