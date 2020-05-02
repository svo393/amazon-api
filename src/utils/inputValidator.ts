import { CategoryCreateInput, CategoryUpdateInput, ItemUpdateInput, UserCreateInput, UserUpdateInput, VendorCreateInput, VendorUpdateInput } from '@prisma/client'
import R from 'ramda'
import { ItemCreateInputRaw, PasswordResetInput, UserLoginInput } from '../types'
import { hasDefinedProps, isBoolean, isEmail, isImage, isInputProvided, isNumber, isPasswordValid, isProvided, isString, isStringOrArray } from './validatorLib'

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
    email: email.param.toLowerCase(),
    password: password.param
  }
}

const checkUserLogin = (object: any): UserLoginInput => {
  const email = R.pipe(
    isProvided,
    isString,
    isEmail
  )({ name: 'email', param: object.email })

  const password = R.pipe(
    isProvided,
    isString
  )({ name: 'password', param: object.password })

  const remember = R.pipe(
    isProvided,
    isBoolean
  )({ name: 'remember', param: object.remember })

  return {
    email: email.param.toLowerCase(),
    password: password.param,
    remember: remember.param
  }
}

const checkUserResetRequest = (object: any): string => {
  const email = R.pipe(
    isProvided,
    isString,
    isEmail
  )({ name: 'email', param: object.email })

  return email.param.toLowerCase()
}

const checkUserResetToken = (object: any): PasswordResetInput => {
  const resetToken = R.pipe(
    isProvided,
    isString
  )({ name: 'resetToken', param: object.resetToken })

  const password = R.pipe(
    isProvided,
    isString,
    isPasswordValid
  )({ name: 'password', param: object.password })

  return {
    resetToken: resetToken.param,
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

  const isAvailable = R.pipe(
    isProvided,
    isBoolean
  )({ name: 'isAvailable', param: object.isAvailable })

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
    isAvailable: isAvailable.param,
    asin: asin.param,
    media: media.param,
    primaryMedia: primaryMedia.param,
    user: user.param,
    category: category.param,
    vendor: vendor.param
  }
}

const checkItemUpdate = (object: any): ItemUpdateInput => {
  isInputProvided(object)

  const name = object.name && isString(
    { name: 'name', param: object.name }
  )

  const price = object.price && isNumber(
    { name: 'price', param: object.price }
  )

  const shortDescription = object.shortDescription && isString(
    { name: 'shortDescription', param: object.shortDescription }
  )

  const longDescription = object.longDescription && isString(
    { name: 'longDescription', param: object.longDescription }
  )

  const stock = object.stock && isNumber(
    { name: 'stock', param: object.stock }
  )

  const asin = object.asin && isString(
    { name: 'asin', param: object.asin }
  )

  const media = object.media && isNumber(
    { name: 'media', param: object.media }
  )

  const primaryMedia = object.primaryMedia && isNumber(
    { name: 'primaryMedia', param: object.primaryMedia }
  )

  const isAvailable = object.isAvailable && isBoolean(
    { name: 'isAvailable', param: object.isAvailable }
  )

  const questions = object.questions && isString(
    { name: 'questions', param: object.questions }
  )

  const category = object.category && isString(
    { name: 'category', param: object.category }
  )

  const vendor = object.vendor && isString(
    { name: 'vendor', param: object.vendor }
  )

  const itemInput = {
    name: name?.param,
    price: price?.param,
    shortDescription: shortDescription?.param,
    longDescription: longDescription?.param,
    stock: stock?.param,
    asin: asin?.param,
    media: media?.param,
    primaryMedia: primaryMedia?.param,
    isAvailable: isAvailable?.param,
    questions: questions?.param,
    category: category?.param,
    vendor: vendor?.param
  }

  return hasDefinedProps(itemInput)
}

const checkItemMediaUpload = (object: any): Express.Multer.File[] => {
  isInputProvided(object, 'Missing images')
  isStringOrArray({ name: 'images', param: object })
  object.map((item: object) => isImage({ name: 'images', param: item }))
  return object
}

const checkNewCategory = (object: any): CategoryCreateInput => {
  const name = R.pipe(
    isProvided,
    isString
  )({ name: 'name', param: object.name })

  const parent = object.parent && isString(
    { name: 'parent', param: object.parent }
  )

  const categoryInput = {
    name: name.param,
    parent: parent?.param
  }

  return hasDefinedProps(categoryInput) as CategoryCreateInput
}

const checkCategoryUpdate = (object: any): CategoryUpdateInput => {
  isInputProvided(object)

  const name = object.name && isString(
    { name: 'name', param: object.name }
  )

  const parent = object.parent && isNumber(
    { name: 'parent', param: object.parent }
  )

  const categoryInput = {
    name: name?.param,
    parent: parent?.param
  }

  return hasDefinedProps(categoryInput)
}

const checkNewVendor = (object: any): VendorCreateInput => {
  const name = R.pipe(
    isProvided,
    isString
  )({ name: 'name', param: object.name })

  const vendorInput = {
    name: name.param
  }

  return hasDefinedProps(vendorInput) as VendorCreateInput
}

const checkVendorUpdate = (object: any): VendorUpdateInput => {
  isInputProvided(object)

  const name = object.name && isString(
    { name: 'name', param: object.name }
  )

  const vendorInput = {
    name: name?.param
  }

  return hasDefinedProps(vendorInput)
}

export default {
  checkNewUser,
  checkUserLogin,
  checkUserUpdate,
  checkUserResetRequest,
  checkUserResetToken,
  checkNewItem,
  checkItemUpdate,
  checkItemMediaUpload,
  checkNewCategory,
  checkCategoryUpdate,
  checkNewVendor,
  checkVendorUpdate
}
