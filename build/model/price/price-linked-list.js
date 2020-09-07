"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PriceLinkedList = void 0;
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
/*
let list: PriceLinkedList = new PriceLinkedList()
list.append(new Price(new Date(), 0, 0, 0, 0))
list.append(new Price(new Date(), 123, 0, 0, 0))
list.print()

let list2: PriceLinkedList = new PriceLinkedList()
list2.print()
*/ 
