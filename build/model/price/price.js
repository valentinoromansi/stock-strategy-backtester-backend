"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Price = void 0;
var direction_1 = require("./direction");
var price_linked_list_1 = require("./price-linked-list");
var Price = /** @class */ (function () {
    function Price(time, open, close, high, low) {
        this.time = time;
        this.open = open;
        this.close = close;
        this.high = high;
        this.low = low;
    }
    Price.prototype.hasConnectedPrices = function (dir, iterNum) {
        var counter = 0;
        var cur = this;
        while (counter != iterNum) {
            if (dir === direction_1.Direction.LEFT && !cur.prev)
                return false;
            if (dir === direction_1.Direction.RIGHT && !cur.next)
                return false;
            cur = dir === direction_1.Direction.LEFT ? cur.prev : cur.next;
            counter++;
        }
        return true;
    };
    Price.prototype.executeEachIteration = function (dir, iterNum, onEachIter) {
        if (!this.hasConnectedPrices(dir, iterNum))
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
var prices = new price_linked_list_1.PriceLinkedList();
prices.append(new Price(new Date(), 1, 1, 1, 1));
prices.append(new Price(new Date(), 2, 2, 2, 2));
prices.last.executeEachIteration(direction_1.Direction.LEFT, 1, function (price) {
    console.log(price.low);
});
