"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerticalSlice = void 0;
var direction_1 = require("./direction");
var price_type_1 = require("../../backtester/types/price-type");
/**
 * Vertical slice includes all attributes and values on given date
 * It consists of:
 *  1.) Date and time
 *  2.) Price attributes - low, high, open, close
 *  3.) Indicator value
 */
var VerticalSlice = /** @class */ (function () {
    function VerticalSlice(time, open, close, high, low) {
        this.time = time;
        this.open = open;
        this.close = close;
        this.high = high;
        this.low = low;
    }
    VerticalSlice.prototype.hasConnectedPrices = function (dir, iterNum) {
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
    VerticalSlice.prototype.getConnectedPrice = function (dir, iterNum) {
        if (iterNum == 0)
            return this;
        if (!this.hasConnectedPrices(dir, iterNum) || iterNum < 0)
            return null;
        var cur = this;
        for (var i = 0; i < iterNum; ++i) {
            cur = dir == direction_1.Direction.LEFT ? cur.prev : cur.next;
        }
        return cur;
    };
    /**
     * Moves from this vertical slice in 'dir' direction 'iterNum' number of times and executes 'onEachIter' for each slice.
     * If iteration number is not specified it iterates in given direction until last slice is reached
     */
    VerticalSlice.prototype.executeEachIteration = function (dir, iterNum, onEachIter) {
        if (iterNum && (!this.hasConnectedPrices(dir, iterNum) || iterNum <= 0))
            return;
        var cur = this;
        // For defined iteraton num. run onEachIter that many times
        if (iterNum != null) {
            for (var i = 0; i <= iterNum; ++i) {
                onEachIter(cur);
                cur = dir == direction_1.Direction.LEFT ? cur.prev : cur.next;
            }
        }
        // For undefined iteraton num. run onEachIter as many times as there are prices
        else {
            onEachIter(cur);
            while (cur.next) {
                onEachIter(cur);
                cur = cur.next;
            }
        }
    };
    VerticalSlice.getPriceType = function (price) {
        if (price.close > price.open)
            return price_type_1.PriceType.BULLISH;
        if (price.close < price.open)
            return price_type_1.PriceType.BEARISH;
        return price_type_1.PriceType.UNDECISIVE;
    };
    return VerticalSlice;
}());
exports.VerticalSlice = VerticalSlice;
