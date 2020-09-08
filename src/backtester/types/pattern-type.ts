export enum PatternType {
  BULLISH_ENGULFING,
  BULL_ENG_BELOW_BELOW, // both open and close below EMA
  BULL_ENG_ABOVE_ABOVE, // both open and close above EMA
  BULL_ENG_BELOW_THROUGH, // engulfed open and close below, engulfing closed above EMA
  BULL_ENG_THROUGH_THROUGH, // engulfed opened above close below, engulfing opened below close above
}
