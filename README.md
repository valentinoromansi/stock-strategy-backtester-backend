# Install and Run
## Requirements:
- Node.js 12.18.3
- Npm 6.14.6
- Python 2.7.15
## Build:
- `npm run build`
## Start:
- `npm start`


</br></br></br>


# API - Usage and requirements
  - APIs used for fetching:
    - Symbols - `https://api.twelvedata.com/stocks?exchange=NASDAQ`
    - Fundamentals - `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=${apikey}`
    - Vertical slice data - `https://api.twelvedata.com/time_series?&symbol=${symbol}&interval=${interval}&apikey=${apikey}&outputsize=5000`
  - Check if API keys in [api-data.ts](src/data-extractor/api-data.ts) for fetching slice data and fundamentals are still valid


</br></br></br>


# Quick start
1. Call `/authenticate` to fetch JWT token used as `Bearer token` for every other service request
2. Call `/update-stock-data` to fetch all fundamental and price data for every stock
3. Call `/save-strategy` to save strategy
4. Call `/update-strategy-reports` to generate reports based on saved strategies - generated reports returned in response
5. Call `/get-strategy-reports` to fetch generated reports


</br></br></br>



<b>ValueExtractionRule:</b>

```
1. Tells how to extract value from attribute on slice relative to given slice
2. Tells how to calculate value made from 2 attributes on 2 different slices using percentage
```

<b>ConditionalRule:</b>

```
1. Tells if attribute value is SAME/BIGGER/SMALLLER then other attribute value
```

</br></br></br>

# Endpoints

## __/authenticate__  ![POST](https://img.shields.io/badge/POST-purple?style=flat)
- Generates JWT access token if authentication succedes
- Allowed usernames/passwords for authentication to succede are stored in .env file and should be moved to database layer in future
- Access token must be sent in future requests as `authroization` header in format 
`authorization=Bearer TOKEN`:
    
    ```
    authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiSXZpY2EiLCJpYXQiOjE2NzQ3Mzk1MTN9.f8kmkDEk4PEOaIW3lKLVI7BhzA9--UX55NJ9pe7KOk8'
    ```
</br>

  _REQUEST_ :
  ```json
  {
    "username": "Dontsmokekids", 
    "password": "comebackdad"
  }
  ```
  _RESPONSE_ :
  ```json
  {
    "data": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiSXZpY2EiLCJpYXQiOjE2NzQ3NDIxNjZ9.   TNC9UveX7TmOnwRym2bZRuJDPWbogmEIoH5zL-AiLXE",
    "status": 200
  }
  ```


</br></br>

## __/update-stock-data__  ![GET](https://img.shields.io/badge/POST-purple?style=flat)
  - Fetches stock symbols, vertical slices, and fundamentals data
  - Saves fetched data in [resource/stocks](src/resources/stocks) in folder for each timeframe

  _RESPONSE_ :
  ```json
  {
    "status": 200
  }
  ```

</br></br>

## __/get-stock__  ![POST](https://img.shields.io/badge/POST-purple?style=flat)
  - Fetches previously stored stock data from [resource/stocks](src/resources/stocks)
  - Saves fetched data in [resource/stocks](src/resources/stocks) in folder for each timeframe

  _REQUEST_ :
  ```json
  {
    "symbol": "AACG",
    "interval": "15min"
  }
  ```
  _RESPONSE_ :
  ```json
  {
    "data": [
      {
        "date": "2021-08-05T09:30:00.000Z",
        "open": 2.89,
        "close": 2.89,
        "high": 2.8935,
        "low": 2.89,
        "volume": 0
      },
      {
        "date": "2021-08-05T09:30:00.000Z",
        "open": 2.89,
        "close": 2.89,
        "high": 2.8935,
        "low": 2.89,
        "volume": 0
      },
      {
        "date": "2021-08-05T09:45:00.000Z",
        "open": 2.9,
        "close": 2.9,
        "high": 2.9,
        "low": 2.9,
        "volume": 0
      }
    ],
    "status": 200
  }
  ```

</br></br>

## __/save-strategy__  ![POST](https://img.shields.io/badge/POST-purple?style=flat)
  - Saves strategy to [strategies.json](src/resources/strategies.json)

  _REQUEST_ :
  ```json
  {
    "name": "strategy 1",
    "enterValueExRule": {
      "id": 1,
      "attribute1": "OPEN",
      "attribute2": null,
      "percent": null,
      "isRelative": false
    },
    "stopLossValueExRule": {
      "id": 0,
      "attribute1": "OPEN",
      "attribute2": "CLOSE",
      "percent": 50,
      "isRelative": true
    },
    "riskToRewardList": [
    	1,
    	2
    ],
    "strategyConRules": [
    	{
    	  "valueExtractionRule1": {
    	    "id": 0,
    	    "attribute1": "OPEN",
    	    "isRelative": false
    	  },
    	  "position": "BELOW",
    	  "valueExtractionRule2": {
    	    "id": 0,
    	    "attribute1": "CLOSE",
    	    "isRelative": false
    	  }
    	},
    	{
        "valueExtractionRule1": {
        	"id": 1,
        	"attribute1": "OPEN",
        	"isRelative": false
        },
        "position": "BELOW",
        "valueExtractionRule2": {
        	"id": 1,
        	"attribute1": "LOW",
        	"isRelative": false
        }
      }
    ]
  }
  ```
  _RESPONSE_ :
  ```json
  {
    "status": 200
  }
  ```

</br></br>

## __/delete-strategy__  ![POST](https://img.shields.io/badge/POST-purple?style=flat)
  - Deletes strategy from [strategies.json](src/resources/strategies.json)

  _REQUEST_ :
  ```json
  {
    "name": "strategy 1"
  }
  ```
  _RESPONSE_ :
  ```json
  {
    "status": 200
  }
  ```

</br></br>

## __/get-strategies__  ![GET](https://img.shields.io/badge/GET-blue?style=flat)
  - Deletes strategy from [strategies.json](src/resources/strategies.json)

  _RESPONSE_ :
  ```json
  {
    "data": [
      {
        "name": "strategy 1",
        "enterValueExRule": {
          "id": 1,
          "attribute1": "OPEN",
          "attribute2": null,
          "percent": null,
          "isRelative": false
        },
        "stopLossValueExRule": {
          "id": 3,
          "attribute1": "CLOSE",
          "attribute2": null,
          "percent": null,
          "isRelative": false
        },
        "riskToRewardList": [
          1,
          2
        ],
        "strategyConRules": [
          {
            "valueExtractionRule1": {
                "id": 0,
                "attribute1": "OPEN",
                "isRelative": false
            },
            "position": "BELOW",
            "valueExtractionRule2": {
                "id": 0,
                "attribute1": "CLOSE",
                "isRelative": false
            }
          },
          {
            "valueExtractionRule1": {
              "id": 1,
              "attribute1": "OPEN",
              "isRelative": false
            },
            "position": "BELOW",
            "valueExtractionRule2": {
              "id": 1,
              "attribute1": "LOW",
              "isRelative": false
            }
          }
        ]
      },
      {
        "name": "strategy 2",
        "enterValueExRule": {
          "id": 1,
          "attribute1": "OPEN",
          "attribute2": null,
          "percent": null,
          "isRelative": false
        },
        "stopLossValueExRule": {
          "id": 3,
          "attribute1": "CLOSE",
          "attribute2": null,
          "percent": null,
          "isRelative": false
        },
        "riskToRewardList": [
          1,
          2
        ],
        "strategyConRules": [
          {
            "valueExtractionRule1": {
              "id": 0,
              "attribute1": "OPEN",
              "isRelative": false
            },
            "position": "BELOW",
            "valueExtractionRule2": {
              "id": 0,
              "attribute1": "CLOSE",
              "isRelative": false
            }
          }                
        ]
      }
    ],
    "status": 200
  }
  ```

</br></br>

## __/update-strategy-reports__  ![POST](https://img.shields.io/badge/POST-purple?style=flat)
  - Generates report based on saved strategy/strategies abd saves them in [backtest-reports.json](src/resources/backtest-reports.json)

  _REQUEST (generates single report for specific saved strategy)_ :
  ```json
  {
    "strategyName": "strategy 1"
  }
  ```

  _REQUEST (generates reports for all saved strategies)_ :
  ```json
  {
  }  
  ```

  _RESPONSE_ :
  ```json
  {
    "status": 200
  }
  ```
  </br></br>

## __/get-strategy-reports__  ![GET](https://img.shields.io/badge/GET-blue?style=flat)
  - Fetches previously generated strategy reports from [backtest-reports.json](src/resources/backtest-reports.json)

  _RESPONSE_ :
  ```json
  [
    {
      "strategyName": "strategy 1",
      "backtestResults":
      [
        {				
          "stockName": "ACHH",
          "interval": "15min",
          "rewardToRisk": "1",
          "timesProfited":645,
          "timesLost":1488,
          "timesIndecisive":354,
          "winRate":0.30239099859353025,
          "plRatio":0.4334677419354839,
          "plFactor":0.3023909985935302,
          "tradeDateAndValues":[
          	{
          		"tradeResult":1,
          		"enterDate":"2021-08-05T10:00:00.000Z",
          		"enterValue":2.8955,
          		"stopLossHitDate":
          		"2021-08-05T10:45:00.000Z",
          		"stopLossValue":2.8915,
          		"profitHitDate":null,
          		"profitValue":2.8995
          	},
          	{
          		"tradeResult":1,
          		"enterDate":"2021-08-05T10:15:00.000Z",
          		"enterValue":2.8915,
          		"stopLossHitDate":
          		"2021-08-05T10:45:00.000Z",
          		"stopLossValue":2.8901,
          		"profitHitDate":null,
          		"profitValue":2.8929000000000005
          	}
          ]
        },
        {
          "stockName": "ACBB",
          "interval": "1h",
          "rewardToRisk": "1",
          "timesProfited":645,
          "timesLost":1488,
          "timesIndecisive":354,
          "winRate":0.30239099859353025,
          "plRatio":0.4334677419354839,
          "plFactor":0.3023909985935302,
          "tradeDateAndValues":[
          	{
          		"tradeResult":1,
          		"enterDate":"2021-08-05T10:00:00.000Z",
          		"enterValue":2.8955,
          		"stopLossHitDate":
          		"2021-08-05T10:45:00.000Z",
          		"stopLossValue":2.8915,
          		"profitHitDate":null,
          		"profitValue":2.8995
          	}
          ]
        }
      ]
    },
    {
      "strategyName": "3 bar play",
      "backtestResults":[
        {				
          "stockName": "ACHH",
          "interval": "1day",
          "rewardToRisk": "2",
          "timesProfited":645,
          "timesLost":1488,
          "timesIndecisive":354,
          "winRate":0.30239099859353025,
          "plRatio":0.4334677419354839,
          "plFactor":0.3023909985935302,
          "tradeDateAndValues":[
          	{
          		"tradeResult":1,
          		"enterDate":"2021-08-05T10:00:00.000Z",
          		"enterValue":2.8955,
          		"stopLossHitDate":
          		"2021-08-05T10:45:00.000Z",
          		"stopLossValue":2.8915,
          		"profitHitDate":null,
          		"profitValue":2.8995
          	}
          ]
        }
      ]
    }
  ]
  ```

