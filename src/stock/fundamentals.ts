export class Fundamentals {
  constructor(
    assetType: string,
    sector: string,
    industry: string,
    marketCapitalization: number,
    sharesOutstanding: number,
    sharesFloat: number,
    sharesShort: number
  ) {
    this.assetType = assetType
    this.sector = sector
    this.industry = industry
    this.marketCapitalization = marketCapitalization
    this.sharesOutstanding = sharesOutstanding
    this.sharesFloat = sharesFloat
    this.sharesShort = sharesShort
  }

  assetType: string
  sector: string
  industry: string
  marketCapitalization: number
  sharesOutstanding: number
  sharesFloat: number
  sharesShort: number
}
