import { StrategyVisual } from "../model/visuals/strategy-visual"

export const yml: {
  excelPath: string
  strategies: { groupName: string; name: string; description: string[]; visuals: StrategyVisual[] }[]
} = {
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
        new StrategyVisual({ ema: 0.4 }),
        new StrategyVisual({ open: 0.7, close: 0.3, ema: 0.5 }),
        new StrategyVisual({ open: 0.3, close: 0.8, ema: 0.65 }),
        new StrategyVisual({ ema: 0.8 }),
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
        new StrategyVisual({ ema: 0.4 }),
        new StrategyVisual({ open: 0.3, close: 0.15, ema: 0.5 }),
        new StrategyVisual({ open: 0.3, close: 0.8, ema: 0.65 }),
        new StrategyVisual({ ema: 0.8 }),
      ],
    },
  ],
}
