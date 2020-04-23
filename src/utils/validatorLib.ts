import StatusError from './StatusError'
import checkEmail from 'validator/lib/isEmail'

type CP = {
  name?: string;
  param: any;
}

export const isProvided = ({ name, param }: CP): CP => {
  if (!param) {
    throw new StatusError(400, `Missing ${name}`)
  }
  return { name, param }
}

export const isString = ({ name, param }: CP): CP => {
  if (typeof (param) !== 'string' && !(param instanceof String)) {
    throw new StatusError(400, `Incorrect ${name}: ${param}`)
  }
  return { name, param }
}

export const isEmail = ({ param }: CP): CP => {
  if (!checkEmail(param)) {
    throw new StatusError(400, `Incorrect email: ${param}`)
  }
  return { param }
}

export const passwordIsValid = ({ param }: CP): CP => {
  if (param.length < 8) {
    throw new StatusError(422, 'Password must be at least 8 characters')
  }
  return { param }
}
