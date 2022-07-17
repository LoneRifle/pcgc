import { BadPostalCodeError } from '../errors'
import { makePcgc } from '../index'
import { ResultType } from '../result'

describe('index', () => {
  describe('makePcgc', () => {
    const lookup = jest.fn()
    const pcgc = makePcgc(lookup)

    beforeEach(() => {
      lookup.mockReset()
    })

    it('rejects with BadPostalCodeError on bad postal code', async () => {
      const badCode = 'bad'
      await expect(pcgc(badCode)).rejects.toStrictEqual(
        new BadPostalCodeError(badCode),
      )
      expect(lookup).not.toHaveBeenCalled()
    })

    it('invokes lookup on defaults', async () => {
      const postalCode = '123456'
      const point = {}
      lookup.mockResolvedValue(point)

      const actual = await pcgc(postalCode)

      expect(actual).toStrictEqual(point)
      expect(lookup).toHaveBeenCalledWith(postalCode, {
        resultType: ResultType.WGS84,
      })
    })

    it('invokes lookup on specified options', async () => {
      const options = {
        init: {} as RequestInit,
        resultType: ResultType.RAW,
      }
      const postalCode = '123456'
      const point = {}
      lookup.mockResolvedValue(point)

      const actual = await pcgc(postalCode, options)

      expect(actual).toStrictEqual(point)
      expect(lookup).toHaveBeenCalledWith(postalCode, options)
    })
  })
})
