import isEmail from 'validator/lib/isEmail'
import { NewUser } from '../types'
import StatusError from './StatusError'

const isString = (param: any): param is string => {
  return typeof (param) === 'string' || param instanceof String
}

const parseAsString = (param: any, name: string): string => {
  if (!param || !isString(param)) {
    throw new StatusError(400, `Incorrect or missing ${name}: ${param || ''}`)
  }
  return param
}

const parseAsEmail = (param: any, name: string): string => {
  if (!param || !isString(param) || !isEmail(param)) {
    throw new StatusError(400, `Incorrect or missing ${name}: ${param || ''}`)
  }
  return param.toLowerCase()
}

const toNewItem = (object: any): object => object
const toUpdatedItem = (object: object, cookies: object): object => object
const toDeletedItem = (id: string, cookies: object): string => id

const authUserInput = (object: any): NewUser => {
  return {
    email: parseAsEmail(object.email, 'email'),
    password: parseAsString(object.password, 'password')
  }
}

export default {
  toNewItem,
  toUpdatedItem,
  toDeletedItem,
  authUserInput
}
