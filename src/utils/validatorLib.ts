import { Role } from '@prisma/client'
import R from 'ramda'
import checkEmail from 'validator/lib/isEmail'
import StatusError from './StatusError'

type CP = (params: {
  name?: string;
  param: any;
}) => {
  name?: string;
  param: any;
}

export const isProvided: CP = ({ name, param }) => {
  if (typeof (param) === 'undefined') {
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

export const isInputProvided = (param: object, msg = 'Missing user input'): void => {
  if (R.isEmpty(param)) {
    throw new StatusError(400, msg)
  }
}

export const isString: CP = ({ name, param }) => {
  if (typeof (param) !== 'string' && !(param instanceof String)) {
    throw new StatusError(400, `Incorrect ${name}: ${param}`)
  }
  return { name, param }
}

export const isStringOrArray: CP = ({ name, param }) => {
  if (typeof (param) !== 'string' && !(param instanceof String) && !Array.isArray(param)) {
    throw new StatusError(400, `Incorrect ${name}: ${param}`)
  }
  return { name, param }
}

export const isNumber: CP = ({ name, param }) => {
  if (typeof (param) !== 'number') {
    throw new StatusError(400, `Incorrect ${name}: ${param}`)
  }
  return { name, param }
}

export const isBoolean: CP = ({ name, param }) => {
  if (typeof (param) !== 'boolean') {
    throw new StatusError(400, `Incorrect ${name}: ${param}`)
  }
  return { name, param }
}

export const isEmail: CP = ({ name, param }) => {
  if (!checkEmail(param)) {
    throw new StatusError(400, `Incorrect email: ${param}`)
  }
  return { name, param }
}

export const isRole: CP = ({ name, param }) => {
  if (!Role) {
    throw new StatusError(400, `Incorrect role: ${param}`)
  }
  return { name, param }
}

export const isPasswordValid: CP = ({ name, param }) => {
  if (param.length < 8) {
    throw new StatusError(422, 'Password must be at least 8 characters')
  }
  return { name, param }
}

export const isImage: CP = ({ name, param }) => {
  if (!param.mimetype || ![ 'image/png', 'image/jpeg', 'image/webp' ].includes(param.mimetype)) {
    throw new StatusError(400, 'Image files only!')
  }
  return { name, param }
}
