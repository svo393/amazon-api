import StatusError from './StatusError'
import checkEmail from 'validator/lib/isEmail'
import * as R from 'ramda'

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

export const hasDefinedProps = (param: object): object => {
  const strippedObject = JSON.parse(JSON.stringify(param))

  if (R.isEmpty(strippedObject)) {
    throw new StatusError(400, 'Invalid user input')
  }
  return strippedObject
}

export const isInputProvided = (param: object): void => {
  if (R.isEmpty(param)) {
    throw new StatusError(400, 'Missing user input')
  }
}

export const isString = ({ name, param }: CP): CP => {
  if (typeof (param) !== 'string' && !(param instanceof String)) {
    throw new StatusError(400, `Incorrect ${name}: ${param}`)
  }
  return { name, param }
}

export const isBoolean = ({ name, param }: CP): CP => {
  if (typeof (param) !== 'boolean') {
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

export const isPasswordValid = ({ param }: CP): CP => {
  if (param.length < 8) {
    throw new StatusError(422, 'Password must be at least 8 characters')
  }
  return { param }
}
