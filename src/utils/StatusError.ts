interface StatusError extends Error {
  statusCode: number;
  location?: string;
}

class StatusError extends Error {
  constructor (statusCode: number, message: string, location?: string) {
    super(message)
    this.statusCode = statusCode
    this.location = location
    Error.captureStackTrace(this, StatusError)
  }
}

export default StatusError
