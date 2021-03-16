"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BacktestData = void 0;
var direction_1 = require("../../model/price/direction");
var TradeResult;
(function (TradeResult) {
    TradeResult[TradeResult["PROFIT"] = 0] = "PROFIT";
    TradeResult[TradeResult["LOSS"] = 1] = "LOSS";
    TradeResult[TradeResult["INDECISIVE"] = 2] = "INDECISIVE";
    TradeResult[TradeResult["NONE"] = 3] = "NONE";
})(TradeResult || (TradeResult = {}));
var BacktestData = /** @class */ (function () {
    function BacktestData(riskToReward) {
        this.timesProfited = 0;
        this.timesLost = 0;
        this.timesIndecisive = 0;
        this.winRate = 0;
        this.riskToReward = riskToReward;
    }
    BacktestData.prototype.doBacktest = function (slice0, strategy) {
        var _this = this;
        // get enter value
        var enterSlice = slice0.getConnectedPrice(direction_1.Direction.RIGHT, strategy.enterEntity.id);
        if (!enterSlice.next)
            return false;
        var enter = strategy.enterEntity.getValueRelativeToAttributes(enterSlice);
        // get stop loss value
        var stopLossSlice = slice0.getConnectedPrice(direction_1.Direction.RIGHT, strategy.stopLossEntity.id);
        var stopLoss = strategy.stopLossEntity.getValueRelativeToAttributes(stopLossSlice);
        // get take profit value
        console.log(enter, stopLoss);
        if (enter - stopLoss == 0)
            return false;
        var takeProfit = enter + Math.abs(enter - stopLoss) * this.riskToReward;
        // check if profit/loss value is hit for each next candle
        var backtestSuccess = false;
        enterSlice.next.executeEachIteration(direction_1.Direction.RIGHT, null, function (slice) {
            var result = _this.getTradeResult(takeProfit, stopLoss, slice.high, slice.low);
            if (result === TradeResult.PROFIT)
                _this.timesProfited += 1;
            else if (result === TradeResult.LOSS)
                _this.timesLost += 1;
            else if (result === TradeResult.INDECISIVE)
                _this.timesIndecisive += 1;
            // If result value is profit, loss or indecisive then calculate win rate and stop further backtesting
            if (result !== TradeResult.NONE) {
                var profitsAndLoses = _this.timesProfited + _this.timesLost;
                _this.winRate = (profitsAndLoses != 0) ? _this.timesProfited / profitsAndLoses : 0;
                backtestSuccess = true;
                return false;
            }
            // If there is no next slice return failed backtest
            if (!slice.next) {
                backtestSuccess = false;
                return false;
            }
            return true;
        });
        return backtestSuccess;
    };
    BacktestData.prototype.getTradeResult = function (takeProfit, stopLoss, high, low) {
        console.log(takeProfit, stopLoss, high, low);
        if (high > takeProfit && low < stopLoss)
            return TradeResult.INDECISIVE;
        else if (high > takeProfit)
            return TradeResult.PROFIT;
        else if (low < stopLoss)
            return TradeResult.LOSS;
        return TradeResult.NONE;
    };
    BacktestData.prototype.print = function () {
        console.log({
            testSample: this.timesProfited + this.timesLost,
            riskToReward: '1:' + this.riskToReward,
            winRate: this.winRate * 100 + '%',
            profitToRiskRatio: (this.timesProfited * this.riskToReward) - this.timesLost + 'R',
            timesProfited: this.timesProfited,
            timesLost: this.timesLost,
            timesIndecisive: this.timesIndecisive
        });
    };
    return BacktestData;
}());
exports.BacktestData = BacktestData;
