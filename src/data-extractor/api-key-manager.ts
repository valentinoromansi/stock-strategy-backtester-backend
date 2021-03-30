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

export class ApiKeysManager {
  constructor() {
    this.apiKeys = [
      new ApiKey("d6fa58c0870e449cba8dce5299ad20fe", "6I0BYWVEBUDZTPV6"),
      new ApiKey("1e1bc0e7f2aa414086e174b890a3826a", "IDA8P4QU50KOIVVO"),
      new ApiKey("c7a59ff1b766435eae0efa2bcc9428b1", "IGCCZQXJO67364SJ"),
      new ApiKey("40bbfe17f23b426b8425a4ef4a1db03b", "N9BUTXAUVDUV949O"),
      new ApiKey("e7c9e1c4f83747b6852951df31fd7d48", "U3K428ORVM0N42N5"),
      new ApiKey("23c640b83f6544ff81aa24feced78af6", "MRZO4BIL8UQMK5LP"),
      new ApiKey("0866dfd816bf4cb5970663a98461ae41", "FNB287BIC507MG2I"),
    ]
  }
  apiKeys: ApiKey[]
  secToWait: number = 60

  getAvailableApiKey(): ApiKey {
    for (const key of this.apiKeys) {
      if ((Date.now() - +key.lastUsageTime) / 1000 >= this.secToWait) {
        return key
      }
    }
    return null
  }

  getWaitingTimeInSec(): number {
    let timesInSec: number[] = []
    this.apiKeys.forEach((key) => {
      timesInSec.push((Date.now() - +key.lastUsageTime) / 1000)
    })
    return Math.max(...timesInSec) > 60 ? 0 : 60 - Math.max(...timesInSec)
  }

  isApiKeyAvailable(): boolean {
    return this.getWaitingTimeInSec() == 0
  }

  useApiKey(apiKey: ApiKey) {
    apiKey.lastUsageTime = new Date()
  }
}
