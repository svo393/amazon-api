interface StatusError extends Error {
  statusCode: number;
}

class StatusError extends Error {
  constructor (statusCode: number, message: string) {
    super(message)
    this.statusCode = statusCode
    Error.captureStackTrace(this, StatusError)
  }
}

export default StatusError
