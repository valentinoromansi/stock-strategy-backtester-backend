"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var price_1 = require("../../../src/model/price/price");
var price_linked_list_1 = require("../../../src/model/price/price-linked-list");
test("append must properly append price and update next/prev refrences", function () {
    var prices = new price_linked_list_1.PriceLinkedList();
    expect(prices.first).toBeUndefined();
    expect(prices.last).toBeUndefined();
    // first price added
    prices.append(new price_1.Price(new Date(), 1, 1, 1, 1));
    expect(prices.first).toBeDefined();
    expect(prices.first.open).toBe(1);
    expect(prices.first.prev).toBeUndefined();
    expect(prices.first.next).toBeUndefined();
    expect(prices.last).toBeDefined();
    expect(prices.last.next).toBeUndefined();
    expect(prices.last.prev).toBeUndefined();
    expect(prices.first).toBe(prices.last);
    // second price added
    prices.append(new price_1.Price(new Date(), 2, 2, 2, 2));
    expect(prices.first).toBeDefined();
    expect(prices.last.open).toBe(2);
    expect(prices.first.open).toBe(1);
    expect(prices.first.prev).toBeUndefined();
    expect(prices.first.next.open).toBe(2);
    expect(prices.last).toBeDefined();
    expect(prices.last.next).toBeUndefined();
    expect(prices.last.prev.open).toBe(1);
    // third price added
    prices.append(new price_1.Price(new Date(), 3, 3, 3, 3));
    expect(prices.first).toBeDefined();
    expect(prices.first.open).toBe(1);
    expect(prices.first.prev).toBeUndefined();
    expect(prices.first.next.open).toBe(2);
    expect(prices.last).toBeDefined();
    expect(prices.last.open).toBe(3);
    expect(prices.last.next).toBeUndefined();
    expect(prices.last.prev.open).toBe(2);
});
