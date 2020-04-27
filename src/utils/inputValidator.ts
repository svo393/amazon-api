import { UserCreateInput, UserUpdateInput } from '@prisma/client'
import R from 'ramda'
import { hasDefinedProps, isBoolean, isEmail, isInputProvided, isPasswordValid, isProvided, isString } from './validatorLib'

const checkNewUser = (object: any): UserCreateInput => {
  const email = R.pipe(
    isProvided,
    isString,
    isEmail
  )({ name: 'email', param: object.email })

  const password = R.pipe(
    isProvided,
    isString,
    isPasswordValid
  )({ name: 'password', param: object.password })

  return {
    email: email.param,
    password: password.param
  }
}

const checkUserLogin = (object: any): UserCreateInput => {
  const email = R.pipe(
    isProvided,
    isString,
    isEmail
  )({ name: 'email', param: object.email })

  const password = R.pipe(
    isProvided,
    isString
  )({ name: 'password', param: object.password })

  return {
    email: email.param,
    password: password.param
  }
}

const checkUserUpdate = (object: any): UserUpdateInput => {
  isInputProvided(object)

  const password = object.password && R.pipe(
    isString,
    isPasswordValid
  )({ name: 'password', param: object.password })

  const email = object.email && R.pipe(
    isString,
    isEmail
  )({ name: 'email', param: object.email })

  const name = object.name && isString(
    { name: 'name', param: object.name }
  )

  const avatar = object.avatar && isBoolean(
    { name: 'avatar', param: object.avatar }
  )

  const userInput = {
    name: name?.param,
    email: email?.param,
    password: password?.param,
    avatar: avatar?.param
  }

  return hasDefinedProps(userInput)
}

export default {
  checkNewUser,
  checkUserLogin,
  checkUserUpdate
}
