"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var stock_data_1 = require("../../src/model/price/stock-data");
var vertical_slice_1 = require("../../src/model/price/vertical-slice");
var indicator_calculation_1 = require("../../src/backtester/indicator-calculation");
test("smaValue must properly calculate sma value", function () {
    var prices = new stock_data_1.StockData();
    prices.append(new vertical_slice_1.VerticalSlice(new Date(), 0, 1, 0, 0));
    prices.append(new vertical_slice_1.VerticalSlice(new Date(), 0, 2, 0, 0));
    prices.append(new vertical_slice_1.VerticalSlice(new Date(), 0, 3, 0, 0));
    var price1 = prices.append(new vertical_slice_1.VerticalSlice(new Date(), 0, 4, 0, 0));
    var price2 = prices.append(new vertical_slice_1.VerticalSlice(new Date(), 0, 5, 0, 0));
    prices.append(new vertical_slice_1.VerticalSlice(new Date(), 0, 6, 0, 0));
    prices.append(new vertical_slice_1.VerticalSlice(new Date(), 0, 7, 0, 0));
    prices.append(new vertical_slice_1.VerticalSlice(new Date(), 0, 8, 0, 0));
    prices.append(new vertical_slice_1.VerticalSlice(new Date(), 0, 9, 0, 0));
    var sma = indicator_calculation_1.smaValue(-1, price1);
    expect(sma).toBe(null);
    sma = indicator_calculation_1.smaValue(5, price1);
    expect(sma).toBe(null);
    sma = indicator_calculation_1.smaValue(5, price2);
    expect(sma).toBe((5 + 4 + 3 + 2 + 1) / 5);
});
test("emaValue must properly calculate ema4 value", function () {
    var prices = new stock_data_1.StockData();
    prices.append(new vertical_slice_1.VerticalSlice(new Date(), 0, 8, 0, 0));
    prices.append(new vertical_slice_1.VerticalSlice(new Date(), 0, 13, 0, 0));
    prices.append(new vertical_slice_1.VerticalSlice(new Date(), 0, 6, 0, 0));
    prices.append(new vertical_slice_1.VerticalSlice(new Date(), 0, 9, 0, 0)); //                 4 => sma =>  (8 + 13 + 6 + 9) / 4 =    9
    prices.append(new vertical_slice_1.VerticalSlice(new Date(), 0, 12, 0, 0)); //                5 => ema => (12 - 9) * 0.4 + 9 =       10.2
    prices.append(new vertical_slice_1.VerticalSlice(new Date(), 0, 5, 0, 0)); //                6 => ema => (5 - 10.2) * 0.4 + 10.2 =  8.12
    var price = prices.append(new vertical_slice_1.VerticalSlice(new Date(), 0, 22, 0, 0)); //  7 => ema => (22 - 8.12) * 0.4 + 8.12 =  13.67
    var ema = indicator_calculation_1.emaValue(4, price);
    expect(ema).toBe(13.672);
});
/*
test("rsiValue must properly calculate RSI9 value", () => {
  let prices: PriceLinkedList = new PriceLinkedList()
  prices.append(new Price(new Date(), 0, 0.15682, 0, 0))
  prices.append(new Price(new Date(), 0, 0.15676, 0, 0))
  prices.append(new Price(new Date(), 0, 0.15674, 0, 0))
  const price = prices.append(new Price(new Date(), 0, 0.15675, 0, 0))

  let rsi: number = rsiValue(3, price)
  expect(rsi).toBe(19.13186)
})
*/
