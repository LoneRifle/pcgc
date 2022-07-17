import { BadPostalCodeError, RequestFailedError } from '../errors.js'
import { StrictPcgcOptions } from '../index.js'
import { OnemapSearchResults, Point, Result, ResultType } from '../result.js'
import { LookupFunction } from './index.js'

const ONEMAP_LOOKUP_URL =
  'https://developers.onemap.sg/commonapi/search?returnGeom=Y&getAddrDetails=N&searchVal='

const fetchApi = fetch

export const lookup: LookupFunction = async <T extends ResultType>(
  postalCode: string,
  { init, resultType }: StrictPcgcOptions<T>,
  fetch: typeof fetchApi = fetchApi,
): Promise<Result<T>> => {
  let response: Response
  try {
    response = await fetch(`${ONEMAP_LOOKUP_URL}${postalCode}`, init)
  } catch (e) {
    const error = e as Error
    throw new RequestFailedError(error.message, error)
  }
  if (!response || !response.ok) {
    throw new RequestFailedError(response?.statusText)
  }
  const body = await response.json()
  if (resultType === ResultType.RAW) {
    return body as Result<T>
  } else {
    // Pick the coordinates from the first result
    const [result] = (body as OnemapSearchResults)?.results || []
    if (!result) {
      throw new BadPostalCodeError(
        postalCode,
        `No coordinates found for ${postalCode}`,
      )
    }
    const point: Point = {
      type: 'Point',
      coordinates: (resultType === ResultType.SVY21
        ? [result.X, result.Y]
        : [result.LONGITUDE, result.LATITUDE]
      ).map(Number),
    }
    return point as Result<T>
  }
}
