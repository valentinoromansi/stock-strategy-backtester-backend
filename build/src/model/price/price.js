"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Price = void 0;
var direction_1 = require("./direction");
var Price = /** @class */ (function () {
    function Price(time, open, close, high, low) {
        this.time = time;
        this.open = open;
        this.close = close;
        this.high = high;
        this.low = low;
    }
    Price.prototype.hasConnectedPrices = function (dir, iterNum) {
        if (iterNum == 0)
            return false;
        var cur = this;
        for (var i = 0; i < iterNum; ++i) {
            if (dir === direction_1.Direction.LEFT && !cur.prev)
                return false;
            if (dir === direction_1.Direction.RIGHT && !cur.next)
                return false;
            cur = dir === direction_1.Direction.LEFT ? cur.prev : cur.next;
        }
        return true;
    };
    Price.prototype.executeEachIteration = function (dir, iterNum, onEachIter) {
        if (!this.hasConnectedPrices(dir, iterNum) || iterNum <= 0)
            return;
        var cur = this;
        for (var i = 0; i <= iterNum; ++i) {
            onEachIter(cur);
            cur = dir == direction_1.Direction.LEFT ? cur.prev : cur.next;
        }
    };
    return Price;
}());
exports.Price = Price;
