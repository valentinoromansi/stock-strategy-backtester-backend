export class ApiKey {
  constructor(stockSlicesAPIKey: string, stockFundamentalsAPIKey: string) {
    this.verticalSlicesAPIKey = stockSlicesAPIKey
    this.fundamentalsAPIKey = stockFundamentalsAPIKey
    this.lastUsageTime = new Date("1995-01-01T01:00:00")
  }
  verticalSlicesAPIKey: string
  fundamentalsAPIKey: string
  lastUsageTime: Date
}

export const apiKeys = [
	new ApiKey("d6fa58c0870e449cba8dce5299ad20fe", "U3K428ORVM0N42N5"),
	new ApiKey("1e1bc0e7f2aa414086e174b890a3826a", "MRZO4BIL8UQMK5LP"),
	new ApiKey("c7a59ff1b766435eae0efa2bcc9428b1", "IGCCZQXJO67364SJ"),
	new ApiKey("40bbfe17f23b426b8425a4ef4a1db03b", "N9BUTXAUVDUV949O"),
	new ApiKey("e7c9e1c4f83747b6852951df31fd7d48", "6I0BYWVEBUDZTPV6"),
	new ApiKey("23c640b83f6544ff81aa24feced78af6", "IDA8P4QU50KOIVVO"),
	new ApiKey("0866dfd816bf4cb5970663a98461ae41", "FNB287BIC507MG2I"),
]

// Used APIs provide API keys that require 60 sec to be usable again
export const apiKeyRefreshTime = 60

// API for fetching list of stock symbols  
export const symbolsUrl = "https://api.twelvedata.com/stocks?exchange=NASDAQ"

// Supported timeframes
export const intervals = ["15min", "1h", "1day"]

// API for fetching stock price data
export const sliceDataUrl = (symbol: string, apikey: string, interval: string) =>
  `https://api.twelvedata.com/time_series?&symbol=${symbol}&interval=${interval}&apikey=${apikey}&outputsize=5000`

// API for fetching stock fundamental data
export const fundamentalsUrl = (symbol: string, apikey: string) =>
  `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=${apikey}`