import checkEmail from 'validator/lib/isEmail'
import { ObjIndexed } from '../types'
import StatusError from './StatusError'

type CP = (params: {
  name: string
  param: any
}) => {
  name: string
  param: any
}

type IsSomeProvided = {
  input: ({ name?: string; param: any } | undefined)[]
  names: string[]
}

export const isSomeProvided = ({
  input,
  names
}: IsSomeProvided): void => {
  const check = input.map((i) => i !== undefined)

  if (check.length === 0) {
    throw new StatusError(
      400,
      `Missing one of these parameters: "${names.join('", "')}"`
    )
  }
}

export const isProvided: CP = ({ name, param }) => {
  if (param === undefined) {
    throw new StatusError(400, `Missing ${name}`)
  }
  return { name, param }
}

export const isObject: CP = ({ name, param }) => {
  if (Object.prototype.toString.call(param) !== '[object Object]') {
    throw new StatusError(400, `Incorrect ${name}: ${String(param)}`)
  }
  return { name, param }
}

export const hasDefinedProps = <T>(param: T): T => {
  const strippedObject = JSON.parse(JSON.stringify(param))

  if (Object.keys(strippedObject).length === 0) {
    throw new StatusError(400, 'Invalid input')
  }
  return strippedObject
}

export const isInputProvided = (
  param: ObjIndexed,
  msg = 'Missing input'
): void => {
  if (param === undefined) {
    throw new StatusError(400, msg)
  }
}

export const isString: CP = ({ name, param }) => {
  if (typeof param !== 'string' && !(param instanceof String)) {
    throw new StatusError(400, `Incorrect ${name}: ${String(param)}`)
  }
  return { name, param: param.trim() ?? undefined }
}

export const isNonEmptyString: CP = ({ name, param }) => {
  if (
    (typeof param !== 'string' && !(param instanceof String)) ||
    param === ''
  ) {
    throw new StatusError(400, `Incorrect ${name}: ${String(param)}`)
  }
  return { name, param: param.trim() }
}

export const isNonEmptyStringOrNull: CP = ({ name, param }) => {
  if (
    (typeof param !== 'string' &&
      !(param instanceof String) &&
      param !== null) ||
    param === ''
  ) {
    throw new StatusError(400, `Incorrect ${name}: ${String(param)}`)
  }
  return { name, param: param === null ? null : param.trim() }
}

export const isArray: CP = ({ name, param }) => {
  if (!Array.isArray(param)) {
    throw new StatusError(400, `Incorrect ${name}: ${String(param)}`)
  }

  return { name, param }
}

export const isStringOrArray: CP = ({ name, param }) => {
  if (
    typeof param !== 'string' &&
    !(param instanceof String) &&
    !Array.isArray(param)
  )
    throw new StatusError(400, `Incorrect ${name}: ${String(param)}`)

  return { name, param }
}

export const isNumber: CP = ({ name, param }) => {
  if (typeof param !== 'number') {
    throw new StatusError(400, `Incorrect ${name}: ${String(param)}`)
  }
  return { name, param }
}

export const canBeIntegerOrObject: CP = ({ name, param }) => {
  const canBeInteger = Number.isInteger(Number(param))

  if (
    !canBeInteger &&
    Object.prototype.toString.call(param) !== '[object Object]'
  ) {
    throw new StatusError(400, `Incorrect ${name}: ${String(param)}`)
  }
  return { name, param: canBeInteger ? Number(param) : param }
}

export const canBeNumber: CP = ({ name, param }) => {
  if (param !== undefined && !/^\d+(?:\.\d{1,2})?$/.test(param)) {
    throw new StatusError(400, `Incorrect ${name}: ${String(param)}`)
  }
  return {
    name,
    param: param === undefined ? undefined : Number(param)
  }
}

export const isPositiveNumber: CP = ({ name, param }) => {
  if (param < 0) {
    throw new StatusError(400, `${name} must be positive number`)
  }
  return { name, param }
}

export const isDate: CP = ({ name, param }) => {
  if (!/^\d{4}\/[0|1]\d\/[0-3]\d$/.test(param)) {
    throw new StatusError(400, `Incorrect ${name}: ${String(param)}`)
  }
  return { name, param }
}

export const canBeBoolean: CP = ({ name, param }) => {
  const paramBool = JSON.parse(param)

  if (typeof paramBool !== 'boolean') {
    throw new StatusError(400, `Incorrect ${name}: ${String(param)}`)
  }
  return { name, param: paramBool }
}

export const isEmail: CP = ({ name, param }) => {
  if (!checkEmail(param)) {
    throw new StatusError(400, `Incorrect email: ${String(param)}`)
  }
  return { name, param }
}

export const isPasswordValid: CP = ({ name, param }) => {
  if (param.length < 8) {
    throw new StatusError(
      422,
      'Password must be at least 8 characters'
    )
  }
  return { name, param }
}

export const isImage: CP = ({ name, param }) => {
  if (
    !param.mimetype ||
    !['image/png', 'image/jpeg', 'image/webp'].includes(
      param.mimetype
    )
  ) {
    throw new StatusError(415, 'Image files only!')
  }
  return { name, param }
}
