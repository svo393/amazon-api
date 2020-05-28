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

export const hasDefinedProps = <T>(param: object): T => {
  const strippedObject = JSON.parse(JSON.stringify(param))

  if (R.isEmpty(strippedObject)) {
    throw new StatusError(400, 'Invalid input')
  }
  return strippedObject
}

export const isInputProvided = (param: object, msg = 'Missing input'): void => {
  if (R.isEmpty(param) || R.isNil(param)) {
    throw new StatusError(400, msg)
  }
}

export const isString: CP = ({ name, param }) => {
  if (typeof (param) !== 'string' && !(param instanceof String)) {
    throw new StatusError(400, `Incorrect ${name}: ${param}`)
  }
  return { name, param: param.trim() }
}

export const isArray: CP = ({ name, param }) => {
  if (!Array.isArray(param)) {
    throw new StatusError(400, `Incorrect ${name}: ${param}`)
  }
  return { name, param }
}

export const isStringOrArray: CP = ({ name, param }) => {
  if (
    typeof (param) !== 'string' &&
    !(param instanceof String) &&
    !Array.isArray(param)
  ) throw new StatusError(400, `Incorrect ${name}: ${param}`)

  return { name, param }
}

export const isNumber: CP = ({ name, param }) => {
  if (typeof (param) !== 'number') {
    throw new StatusError(400, `Incorrect ${name}: ${param}`)
  }
  return { name, param }
}

export const canBeNumber: CP = ({ name, param }) => {
  if (typeof (parseInt(param)) !== 'number') {
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

export const isProductParameter: CP = ({ name, param }) => {
  if (
    !(
      typeof (param.name) === 'string' ||
      param.name instanceof String
    ) ||
    !(
      typeof (param.value) === 'string' ||
       param.value instanceof String
    )
  ) throw new StatusError(400, `Incorrect ${name}: ${param}`)

  return { name, param }
}

export const isGroup: CP = ({ name, param }) => {
  if (
    !(
      typeof (param.name) === 'string' ||
      param.name instanceof String
    ) ||
    !(
      typeof (param.value) === 'string' ||
       param.value instanceof String
    )
  ) throw new StatusError(400, `Incorrect ${name}: ${param}`)

  return { name, param }
}
