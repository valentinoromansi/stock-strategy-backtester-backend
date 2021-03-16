"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StockBacktest = void 0;
var StockBacktest = /** @class */ (function () {
    function StockBacktest(stockName, riskToReward) {
        this.won = 0;
        this.lost = 0;
        this.indecisive = 0;
        this.finalRiskReward = 0;
        this.stockName = stockName;
        this.riskToReward = riskToReward;
    }
    return StockBacktest;
}());
exports.StockBacktest = StockBacktest;
