- [] GET method /strategies => Get general strategy data -> [{name, description, patternVisuals}, ...]
- [] POST method /backtest => Get backtest data -> [{patternName, stockName, win, loss, earnedRR, risk, reward, casesAmount }, ...]

Stock names - https://api.twelvedata.com/stocks?exchange=NASDAQ
Stock data(high,low,open,close,volume) - https://api.twelvedata.com/time_series?&symbol=AACG&interval=1h&apikey=d6fa58c0870e449cba8dce5299ad20fe&outputsize=5000
Stock fundamental data() - https://www.alphavantage.co/query?function=OVERVIEW&symbol=AACG&apikey=6I0BYWVEBUDZTPV6

stock num: 3300

== twelvedata ==
twelvedata stock data/min: 5
twelvedata API keys: 10
max speed = 50/min
twelvedata API keys:
d6fa58c0870e449cba8dce5299ad20fe
1e1bc0e7f2aa414086e174b890a3826a
c7a59ff1b766435eae0efa2bcc9428b1
40bbfe17f23b426b8425a4ef4a1db03b
e7c9e1c4f83747b6852951df31fd7d48
23c640b83f6544ff81aa24feced78af6
0866dfd816bf4cb5970663a98461ae41

== alphavantage ==
alphavantage company data/min: 5
alphavantage API keys: 10
max speed = 50/min
alphavantage API keys:
6I0BYWVEBUDZTPV6
IDA8P4QU50KOIVVO
IGCCZQXJO67364SJ
N9BUTXAUVDUV949O
U3K428ORVM0N42N5
MRZO4BIL8UQMK5LP
FNB287BIC507MG2I
UTTQ4SM03UI47BJ4
HWFEH91TR358F97Q
VBXNLKW2KO52CO91

time: ~ 1hr

{
"Symbol": "AACG",
"AssetType": "Common Stock",  
"Sector": "Consumer Defensive",
"Industry": "Education & Training Services",
"MarketCapitalization": "126069760",
"SharesOutstanding": "31350500",
"SharesFloat": "9333057",
"SharesShort": "148394",
}

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
percent: 50
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
percent: 50
}),
})
],
})

STRATEGY AS JSON:
{
"name": "2 bar play",
"enterRad": {
"id": 1,
"period": null,
"type1": "CLOSE"
},
"stopLossRad": {
"id": 0,
"period": null,
"type1": "OPEN",
"type2": "CLOSE",
"percent": 50
},
"riskToRewardList": [1, 2, 3],
"rules": [
{
"valueData1": {
"id": 0,
"period": null,
"type1": "CLOSE"
},
"position": "ABOVE",
"valueData2": {
"id": 1,
"period": null,
"type1": "CLOSE"
}
},
{
"valueData1": {
"id": 0,
"period": null,
"type1": "CLOSE"
},
"position": "ABOVE",
"valueData2": {
"id": 1,
"period": null,
"type1": "OPEN"
}
},
{
"valueData1": {
"id": 1,
"period": null,
"type1": "CLOSE"
},
"position": "ABOVE",
"valueData2": {
"id": 0,
"period": null,
"type1": "OPEN",
"type2": "CLOSE",
"percent": 50
}
}
]
}

// PROFIT
YAHOO stock data: https://finance.yahoo.com/quote/aapl/history?ltr=1

"timesProfited": 63,
"timesLost": 146,
"timesIndecisive": 55,
"winRate": 0.3014354066985646,
"plRatio": 1.2945205479452055,
"plFactor": 0.564179104477612,
