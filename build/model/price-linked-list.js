"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PriceLinkedList = void 0;
var price_1 = require("./price");
var PriceLinkedList = /** @class */ (function () {
    function PriceLinkedList() {
    }
    PriceLinkedList.prototype.append = function (price) {
        if (!this.first && !this.last) {
            this.first = this.last = price;
        }
        else {
            price.prev = this.last;
            this.last.next = price;
        }
    };
    PriceLinkedList.prototype.print = function () {
        if (!this.first && !this.last) {
            console.log("Empty");
            return;
        }
        var cur = this.first;
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
    return PriceLinkedList;
}());
exports.PriceLinkedList = PriceLinkedList;
var list = new PriceLinkedList();
list.append(new price_1.Price(new Date(), 0, 0, 0, 0));
list.append(new price_1.Price(new Date(), 123, 0, 0, 0));
list.print();
var list2 = new PriceLinkedList();
list2.print();
