import { BadPostalCodeError } from './errors.js'
import { lookupDirect, LookupFunction } from './lookup/index.js'
import { Result, ResultType } from './result.js'

export * from './errors.js'
export * from './lookup/index.js'
export * from './result.js'

export type StrictPcgcOptions<T extends ResultType> = {
  init?: RequestInit
  resultType: T
}

export type PcgcOptions<T extends ResultType> = Partial<StrictPcgcOptions<T>>

const DEFAULTS = {
  resultType: ResultType.WGS84,
}

const POSTAL_CODE_REGEX = /^\d{6}$/

export const makePcgc =
  (lookup: LookupFunction) =>
  async <T extends ResultType>(
    postalCode: string,
    options?: PcgcOptions<T>,
  ): Promise<Result<T>> => {
    const finalOptions = {
      ...DEFAULTS,
      ...options,
    }
    if (!POSTAL_CODE_REGEX.test(postalCode)) {
      throw new BadPostalCodeError(postalCode)
    }
    const result = await lookup(postalCode, finalOptions)
    return result as Result<T>
  }

export const pcgc = makePcgc(lookupDirect)

export default pcgc
