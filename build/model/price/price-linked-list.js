"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PriceLinkedList = void 0;
var PriceLinkedList = /** @class */ (function () {
    function PriceLinkedList() {
    }
    PriceLinkedList.prototype.append = function (price) {
        // first price added
        if (!this.first && !this.last) {
            this.first = this.last = price;
        }
        // Second added
        else if (this.first === this.last) {
            this.first.next = price;
            this.last = price;
            this.last.prev = this.first;
        }
        // Append at the end if there are more then 2
        else {
            this.last.next = price;
            price.prev = this.last;
            this.last = price;
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
