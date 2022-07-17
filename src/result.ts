export enum ResultType {
  WGS84 = 'wgs84',
  SVY21 = 'svy21',
  RAW = 'raw',
}

export type Point = {
  type: 'Point'
  coordinates: number[]
}

export type OnemapSearchResults = {
  found: number
  totalNumPages: number
  pageNum: number
  results: {
    SEARCHVAL: string
    X: string
    Y: string
    LATITUDE: string
    LONGITUDE: string
  }[]
}

export type Result<T> = T extends ResultType.WGS84
  ? Point
  : T extends ResultType.SVY21
  ? Point
  : T extends ResultType.RAW
  ? OnemapSearchResults
  : never
