import { ApiKey, apiKeyRefreshTime, apiKeys } from "./api-data"


export class ApiKeysManager {
  constructor() {}

  getAvailableApiKey(): ApiKey {
    for (const key of apiKeys) {
      if ((Date.now() - +key.lastUsageTime) / 1000 >= apiKeyRefreshTime) {
        return key
      }
    }
    return null
  }

  getWaitingTimeInSec(): number {
    let timesInSec: number[] = []
    apiKeys.forEach((key) => {
      timesInSec.push((Date.now() - +key.lastUsageTime) / 1000)
    })
    return Math.max(...timesInSec) > 60 ? 0 : 60 - Math.max(...timesInSec)
  }

  isApiKeyAvailable(): boolean {
    return this.getWaitingTimeInSec() == 0
  }

  //* Must be called after external API server registers that key is in use. Since we don't know it it's best to register time when response has been received
  markApiKeyAsUsed(apiKey: ApiKey) {
    apiKey.lastUsageTime = new Date()
  }
}
