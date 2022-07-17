export class BadPostalCodeError extends TypeError {
  constructor(
    public postalCode: string,
    message = `Bad postal code: ${postalCode}`,
  ) {
    super(message)
  }
}

export class RequestFailedError extends Error {
  constructor(message: string, public cause?: Error) {
    super(message)
  }
}
