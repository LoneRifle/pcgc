import { StrictPcgcOptions } from '../index.js'
import { Result, ResultType } from '../result.js'
import { LookupFunction, lookupDirect } from './index.js'

export interface PostalCodeCache<T extends ResultType = ResultType> {
  has(postalCode: string, resultType: T): Promise<boolean>
  get(postalCode: string, resultType: T): Promise<Result<T>>
  put(postalCode: string, resultType: T, result: Result<T>): Promise<void>
}

export const makeInMemoryCache = (): PostalCodeCache => {
  const cache: Record<ResultType, Record<string, Result<ResultType>>> = {
    [ResultType.WGS84]: {},
    [ResultType.SVY21]: {},
    [ResultType.RAW]: {},
  }
  return {
    async has(postalCode, resultType) {
      return postalCode in cache[resultType]
    },
    async get(postalCode, resultType) {
      return cache[resultType][postalCode]
    },
    async put(postalCode, resultType, result) {
      cache[resultType][postalCode] = result
    },
  }
}

export const addCacheToLookup =
  (
    cache: PostalCodeCache = makeInMemoryCache(),
    lookup: LookupFunction = lookupDirect,
  ): LookupFunction =>
  async <T extends ResultType>(
    postalCode: string,
    { init, resultType }: StrictPcgcOptions<T>,
  ): Promise<Result<T>> => {
    const hasResult = await cache.has(postalCode, resultType)
    if (hasResult) {
      const result = await cache.get(postalCode, resultType)
      return result as Result<T>
    }
    const result = await lookup(postalCode, { init, resultType })
    await cache.put(postalCode, resultType, result)
    return result as Result<T>
  }
