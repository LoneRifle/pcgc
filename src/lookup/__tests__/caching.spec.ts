import { Point, ResultType } from '../../result'
import {
  addCacheToLookup,
  makeInMemoryCache,
  PostalCodeCache,
} from '../caching'
import { LookupFunction } from '../index'

describe('caching', () => {
  describe('addCacheToLookup', () => {
    const postalCode = '123456'
    const resultType = ResultType.WGS84
    const result: Point = { type: 'Point', coordinates: [0, 0] }

    const lookup = jest.fn()
    let cache: PostalCodeCache
    let cachedLookup: LookupFunction

    beforeEach(() => {
      lookup.mockReset()
      cache = makeInMemoryCache()
      cachedLookup = addCacheToLookup(lookup, cache)
    })

    it('returns cached result if found', async () => {
      await cache.put(postalCode, resultType, result)
      const actual = await cachedLookup(postalCode, { resultType })
      expect(actual).toStrictEqual(result)
      expect(lookup).not.toHaveBeenCalled()
    })

    it('caches lookup result on cache miss', async () => {
      lookup.mockResolvedValue(result)
      const actual = await cachedLookup(postalCode, { resultType })
      expect(actual).toStrictEqual(result)
      await expect(cache.has(postalCode, resultType)).resolves.toBe(true)
      await expect(cache.get(postalCode, resultType)).resolves.toBe(result)
    })

    it('returns defined function on default arguments', () => {
      expect(addCacheToLookup()).toBeDefined()
    })
  })
})
