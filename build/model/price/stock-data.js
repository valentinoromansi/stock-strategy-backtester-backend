"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StockData = void 0;
var vertical_slice_1 = require("./vertical-slice");
var direction_1 = require("./direction");
var StockData = /** @class */ (function () {
    function StockData() {
        this.name = 'Stock name';
        this.slices = [];
        this.length = 0;
    }
    StockData.prototype.first = function () {
        return this.slices[0];
    };
    StockData.prototype.last = function () {
        return this.slices[this.length - 1];
    };
    StockData.prototype.append = function (slice, withPointers) {
        if (withPointers === void 0) { withPointers = true; }
        this.length++;
        this.slices.push(slice);
        if (this.slices.length > 1) {
            slice.prev = (withPointers) ? this.slices[this.length - 2] : null;
            slice.prev.next = (withPointers) ? this.slices[this.length - 1] : null;
        }
        return slice;
    };
    StockData.prototype.print = function () {
        if (!this.first && !this.last) {
            console.log("Empty");
            return;
        }
        var cur = this.first();
        var logStr = "[" + cur.open.toString() + "]-";
        var length = 1;
        while (cur.next) {
            logStr += "[" + cur.next.open.toString() + "]-";
            cur = cur.next;
            length++;
        }
        console.log(length);
        console.log(logStr);
    };
    StockData.prototype.getSliceListWithoutPointers = function () {
        var stockData = new StockData();
        this.first().executeEachIteration(direction_1.Direction.RIGHT, null, function (slice) {
            stockData.append(new vertical_slice_1.VerticalSlice(slice.time, slice.high, slice.close, slice.high, slice.low));
            return true;
        });
        return stockData;
    };
    return StockData;
}());
exports.StockData = StockData;
