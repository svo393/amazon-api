import { UserCreateInput, UserUpdateInput } from '@prisma/client'
import checkEmail from 'validator/lib/isEmail'
import StatusError from './StatusError'
import * as R from 'ramda'

type CP = {
  name?: string;
  param: any;
}

const isProvided = ({ name, param }: CP): CP => {
  if (!param) {
    throw new StatusError(400, `Missing ${name}`)
  }
  return { name, param }
}

const isString = ({ name, param }: CP): CP => {
  if (typeof (param) !== 'string' && !(param instanceof String)) {
    throw new StatusError(400, `Incorrect ${name}: ${param}`)
  }
  return { name, param }
}

const isEmail = ({ param }: CP): CP => {
  if (!checkEmail(param)) {
    throw new StatusError(400, `Incorrect email: ${param}`)
  }
  return { param }
}

const passwordIsValid = ({ param }: CP): CP => {
  if (param.length < 8) {
    throw new StatusError(422, 'Password must be at least 8 characters')
  }
  return { param }
}

const checkNewUserInput = (object: any): UserCreateInput => {
  const email = R.pipe(
    isProvided,
    isString,
    isEmail
  )({ name: 'email', param: object.email })

  return {
    email: email.param,
    password: object.password
  }
}

const checkUserLoginInput = () => {
  return null
}

// const updateUserInput = (object: any): UserUpdateInput => {
//   return {
//     name: object.name,
//     avatar: object.avatar,
//     cart: object.cart,
//     email: object.email.toLowerCase(),
//     password: object.password
//   }
// }

export default {
  checkNewUserInput,
  checkUserLoginInput
}
