"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vertical_slice_1 = require("../../../src/model/price/vertical-slice");
var stock_data_1 = require("../../../src/model/price/stock-data");
test("append must properly append price and update next/prev refrences", function () {
    var prices = new stock_data_1.StockData();
    expect(prices.first).toBeUndefined();
    expect(prices.last).toBeUndefined();
    // first price added
    prices.append(new vertical_slice_1.VerticalSlice(new Date(), 1, 1, 1, 1));
    expect(prices.first()).toBeDefined();
    expect(prices.first().open).toBe(1);
    expect(prices.first().prev).toBeUndefined();
    expect(prices.first().next).toBeUndefined();
    expect(prices.last).toBeDefined();
    expect(prices.last().next).toBeUndefined();
    expect(prices.last().prev).toBeUndefined();
    expect(prices.first).toBe(prices.last);
    // second price added
    prices.append(new vertical_slice_1.VerticalSlice(new Date(), 2, 2, 2, 2));
    expect(prices.first).toBeDefined();
    expect(prices.last().open).toBe(2);
    expect(prices.first().open).toBe(1);
    expect(prices.first().prev).toBeUndefined();
    expect(prices.first().next.open).toBe(2);
    expect(prices.last).toBeDefined();
    expect(prices.last().next).toBeUndefined();
    expect(prices.last().prev.open).toBe(1);
    // third price added
    prices.append(new vertical_slice_1.VerticalSlice(new Date(), 3, 3, 3, 3));
    expect(prices.first).toBeDefined();
    expect(prices.first().open).toBe(1);
    expect(prices.first().prev).toBeUndefined();
    expect(prices.first().next.open).toBe(2);
    expect(prices.last).toBeDefined();
    expect(prices.last().open).toBe(3);
    expect(prices.last().next).toBeUndefined();
    expect(prices.last().prev.open).toBe(2);
});
