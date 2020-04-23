import { UserCreateInput, UserUpdateInput } from '@prisma/client'
import * as R from 'ramda'
import { isProvided, isString, isEmail } from './validatorLib'

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

const checkUserUpdateInput = () => {
  return null
}

export default {
  checkNewUserInput,
  checkUserLoginInput,
  checkUserUpdateInput
}
