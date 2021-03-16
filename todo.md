- [] GET method /strategies => Get general strategy data -> [{name, description, patternVisuals}, ...]
- [] POST method /backtest => Get backtest data -> [{patternName, stockName, win, loss, earnedRR, risk, reward, casesAmount }, ...]




//
// 2 bar play
//
STRATEGY:
  const strategy: Strategy = new Strategy({
    name: '2 bar play',
    enterEntity: new GraphEntity({
      id: 1,
      period: null,
      type1: GraphEntityType.CLOSE,
    }),
    stopLossEntity: new GraphEntity({
      id: 0,
      period: null,
      type1: GraphEntityType.OPEN,
      type2: GraphEntityType.CLOSE,
      percent: 0.5
    }),
    rules: [
      // second price closed below first close
      new StrategyRule({
        graphEntity1: new GraphEntity({
          id: 0,
          period: null,
          type1: GraphEntityType.CLOSE,
        }),
        position: GraphPositionType.ABOVE,
        graphEntity2: new GraphEntity({
          id: 1,
          period: null,
          type1: GraphEntityType.CLOSE,
        }),
      }),
      // second price closed above second candles 50% body height
      new StrategyRule({
        graphEntity1: new GraphEntity({
          id: 1,
          period: null,
          type1: GraphEntityType.CLOSE,
        }),
        position: GraphPositionType.ABOVE,
        graphEntity2: new GraphEntity({
          id: 0,
          period: null,
          type1: GraphEntityType.OPEN,
          type2: GraphEntityType.CLOSE,
          percent: 0.5
        }),
      })
    ],
  })

// PROFIT
EXCEL:
time,open,high,low,close
2018-03-13T15:15:00Z,20,23,23,20
2018-03-13T16:00:00Z,21,22,22,21
2018-03-13T18:45:00Z,1,22,22,5
2018-03-14T13:30:00Z,5,23,23,4
2018-03-14T13:35:00Z,3,10,4,4
BACKTEST:
{
  testSample: 1,
  riskToReward: '1:1',
  winRate: '100%',
  profitToRiskRatio: '1R',
  timesProfited: 1,
  timesLost: 0,
  timesIndecisive: 0
}

// LOSS
EXCEL:
time,open,high,low,close
2018-03-13T15:15:00Z,20,23,23,20
2018-03-13T16:00:00Z,21,22,22,21
2018-03-13T18:45:00Z,1,22,22,5
2018-03-14T13:30:00Z,5,23,23,4
2018-03-14T13:35:00Z,3,4,1,4
BACKTEST:
{
  testSample: 1,
  riskToReward: '1:1',
  winRate: '0%',
  profitToRiskRatio: '-1R',
  timesProfited: 0,
  timesLost: 1,
  timesIndecisive: 0
}

// INDECISIVE
EXCEL:
time,open,high,low,close
2018-03-13T15:15:00Z,20,23,23,20
2018-03-13T16:00:00Z,21,22,22,21
2018-03-13T18:45:00Z,1,22,22,5
2018-03-14T13:30:00Z,5,23,23,4
2018-03-14T13:35:00Z,3,10,-10,4
BACKTEST:
{
  testSample: 0,
  riskToReward: '1:1',
  winRate: '0%',
  profitToRiskRatio: '0R',
  timesProfited: 0,
  timesLost: 0,
  timesIndecisive: 1
}