"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.yml = void 0;
var strategy_visual_1 = require("../model/visuals/strategy-visual");
exports.yml = {
    excelPath: "src/resources/excels",
    strategies: [
        {
            groupName: "Bullish engulfing",
            name: "Bullish engulfing - through through",
            description: [
                "Bearish engulfed opens above and closes below EMA",
                "Bullish engulfing opens below and closes above EMA",
            ],
            visuals: [
                new strategy_visual_1.StrategyVisual({ ema: 0.4 }),
                new strategy_visual_1.StrategyVisual({ open: 0.7, close: 0.3, ema: 0.5 }),
                new strategy_visual_1.StrategyVisual({ open: 0.3, close: 0.8, ema: 0.65 }),
                new strategy_visual_1.StrategyVisual({ ema: 0.8 }),
            ],
        },
        {
            groupName: "Bullish engulfing",
            name: "Bullish engulfing - below through",
            description: [
                "Bearish engulfed opens below and closes below EMA",
                "Bullish engulfing opens below and closes above EMA",
            ],
            visuals: [
                new strategy_visual_1.StrategyVisual({ ema: 0.4 }),
                new strategy_visual_1.StrategyVisual({ open: 0.3, close: 0.15, ema: 0.5 }),
                new strategy_visual_1.StrategyVisual({ open: 0.3, close: 0.8, ema: 0.65 }),
                new strategy_visual_1.StrategyVisual({ ema: 0.8 }),
            ],
        },
    ],
};
