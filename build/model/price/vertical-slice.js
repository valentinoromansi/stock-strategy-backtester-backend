"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerticalSlice = void 0;
var direction_1 = require("./direction");
var price_type_1 = require("../../backtester/types/price-type");
var graph_entity_type_1 = require("../../backtester/types/graph-entity-type");
var indicator_calculation_1 = require("../../backtester/indicator-calculation");
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
    VerticalSlice.copy = function (slice) {
        return new VerticalSlice(slice.time, +slice.open, +slice.close, +slice.high, +slice.low);
    };
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
        var continueIteration = true;
        // For defined iteraton num. run onEachIter that many times
        if (iterNum != null) {
            for (var i = 0; i <= iterNum; ++i) {
                continueIteration = onEachIter(cur);
                if (!continueIteration)
                    return;
                cur = dir == direction_1.Direction.LEFT ? cur.prev : cur.next;
            }
        }
        // For undefined iteraton num. run onEachIter as many times as there are prices
        else {
            continueIteration = onEachIter(cur);
            if (!continueIteration)
                return;
            while (cur.next) {
                continueIteration = onEachIter(cur);
                if (!continueIteration)
                    return;
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
    VerticalSlice.prototype.getAttributeValue = function (entityType, indicatorCalcValue) {
        if (indicatorCalcValue === void 0) { indicatorCalcValue = null; }
        switch (entityType) {
            case graph_entity_type_1.GraphEntityType.OPEN:
                return this.open;
            case graph_entity_type_1.GraphEntityType.CLOSE:
                return this.close;
            case graph_entity_type_1.GraphEntityType.HIGH:
                return this.high;
            case graph_entity_type_1.GraphEntityType.LOW:
                return this.low;
            case graph_entity_type_1.GraphEntityType.SMA:
                return indicator_calculation_1.smaValue(indicatorCalcValue, this);
            case graph_entity_type_1.GraphEntityType.EMA:
                return indicator_calculation_1.emaValue(indicatorCalcValue, this);
            case graph_entity_type_1.GraphEntityType.RSI:
                return indicator_calculation_1.rsiValue(indicatorCalcValue, this);
            default:
                return 0;
        }
    };
    return VerticalSlice;
}());
exports.VerticalSlice = VerticalSlice;
