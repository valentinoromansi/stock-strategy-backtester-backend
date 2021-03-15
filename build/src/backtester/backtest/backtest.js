"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BacktestData = void 0;
var direction_1 = require("../../model/price/direction");
var BacktestData = /** @class */ (function () {
    function BacktestData(riskToReward) {
        this.won = 0;
        this.lost = 0;
        this.finalRiskReward = 0;
        this.riskToReward = riskToReward;
    }
    /**
     * This is used to backtest given price, NOT LIST OF PRICES
     * CHANGE THIS SO IT CAN BE DEFINED AND SENT TO BACK FROM FRONT SAME AS STRATEGY IS!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
     */
    BacktestData.prototype.doBacktest = function (price) {
        var _this = this;
        var stopLoss = price.low;
        var enter = price.close;
        var takeProfit = enter + Math.abs(enter - stopLoss) * this.riskToReward;
        price.executeEachIteration(direction_1.Direction.RIGHT, null, function (price) {
            if (price.close > takeProfit || price.high > takeProfit)
                return (_this.won += 1);
            if (price.open < stopLoss || price.low < stopLoss)
                return (_this.lost += 1);
        });
        this.riskToReward = this.won - this.lost;
    };
    return BacktestData;
}());
exports.BacktestData = BacktestData;
/**
 * CHANGE THIS SO IT CAN BE DEFINED AND SENT TO BACK FROM FRONT SAME AS STRATEGY IS!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
 */
