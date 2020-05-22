interface StatusError extends Error {
  statusCode: number;
}

class StatusError extends Error {
  constructor (statusCode = 500, message = 'Internal Server Error') {
    super(message)
    this.statusCode = statusCode
    Error.captureStackTrace(this, StatusError)
  }
}

export default StatusError
