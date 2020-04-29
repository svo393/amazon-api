import { UserCreateInput, UserUpdateInput } from '@prisma/client'
import R from 'ramda'
import { ItemCreateInputRaw } from '../types'
import { hasDefinedProps, isBoolean, isEmail, isInputProvided, isNumber, isPasswordValid, isProvided, isString } from './validatorLib'

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

const checkNewItem = (object: any): ItemCreateInputRaw => {
  const name = R.pipe(
    isProvided,
    isString
  )({ name: 'name', param: object.name })

  const price = R.pipe(
    isProvided,
    isNumber
  )({ name: 'price', param: object.price })

  const shortDescription = R.pipe(
    isProvided,
    isString
  )({ name: 'shortDescription', param: object.shortDescription })

  const longDescription = R.pipe(
    isProvided,
    isString
  )({ name: 'longDescription', param: object.longDescription })

  const stock = R.pipe(
    isProvided,
    isNumber
  )({ name: 'stock', param: object.stock })

  const asin = R.pipe(
    isProvided,
    isString
  )({ name: 'asin', param: object.asin })

  const media = R.pipe(
    isProvided,
    isNumber
  )({ name: 'media', param: object.media })

  const primaryMedia = R.pipe(
    isProvided,
    isNumber
  )({ name: 'primaryMedia', param: object.primaryMedia })

  const user = R.pipe(
    isProvided,
    isString
  )({ name: 'user', param: object.user })

  const category = R.pipe(
    isProvided,
    isString
  )({ name: 'category', param: object.category })

  const vendor = R.pipe(
    isProvided,
    isString
  )({ name: 'vendor', param: object.vendor })

  return {
    name: name.param,
    price: price.param,
    shortDescription: shortDescription.param,
    longDescription: longDescription.param,
    stock: stock.param,
    asin: asin.param,
    media: media.param,
    primaryMedia: primaryMedia.param,
    user: user.param,
    category: category.param,
    vendor: vendor.param
  }
}

export default {
  checkNewUser,
  checkUserLogin,
  checkUserUpdate,
  checkNewItem
}
