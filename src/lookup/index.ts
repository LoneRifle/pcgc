import { StrictPcgcOptions } from '../index.js'
import { ResultType, Result } from '../result.js'

export { lookup as lookupDirect } from './direct.js'
export * from './caching.js'

export type LookupFunction = <T extends ResultType>(
  postalCode: string,
  options: StrictPcgcOptions<T>,
) => Promise<Result<T>>
