import { ItemUpdateInput } from '@prisma/client'
import R from 'ramda'
import { ItemCreateInputRaw, PasswordResetInput, UserLoginInput, UserSignupInput, UserUpdateInput, CategoryCreateInput, CategoryUpdateInput, VendorInput } from '../types'
import { hasDefinedProps, isArray, isBoolean, isEmail, isGroup, isImage, isInputProvided, isItemParameter, isNumber, isPasswordValid, isProvided, isString, isStringOrArray } from './validatorLib'

const checkNewUser = (object: any): UserSignupInput => {
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

  const roleID = object.roleID && isNumber(
    { name: 'roleID', param: object.roleID }
  )

  const userInput = {
    name: name?.param,
    email: email?.param.toLowerCase(),
    password: password?.param,
    avatar: avatar?.param,
    roleID: roleID?.param
  }

  return hasDefinedProps(userInput)
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

const checkNewItem = (object: any): ItemCreateInputRaw => {
  const name = R.pipe(
    isProvided,
    isString
  )({ name: 'name', param: object.name })

  const listPrice = R.pipe(
    isProvided,
    isNumber
  )({ name: 'listPrice', param: object.listPrice })

  const price = R.pipe(
    isProvided,
    isNumber
  )({ name: 'price', param: object.price })

  const description = R.pipe(
    isProvided,
    isString
  )({ name: 'description', param: object.description })

  const brandSection = R.pipe(
    isProvided,
    isString
  )({ name: 'brandSection', param: object.brandSection })

  const stock = R.pipe(
    isProvided,
    isNumber
  )({ name: 'stock', param: object.stock })

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

  const userID = R.pipe(
    isProvided,
    isString
  )({ name: 'userID', param: object.userID })

  const categoryName = R.pipe(
    isProvided,
    isString
  )({ name: 'categoryName', param: object.categoryName })

  const vendorName = R.pipe(
    isProvided,
    isString
  )({ name: 'vendorName', param: object.vendorName })

  const groups = R.pipe(
    isProvided,
    isArray
  )({ name: 'groups', param: object.groups })

  groups.param.map((p: object) =>
    isGroup({ name: 'itemParameter', param: p }))

  const itemParameters = R.pipe(
    isProvided,
    isArray
  )({ name: 'itemParameters', param: object.itemParameters })

  itemParameters.param.map((p: object) =>
    isItemParameter({ name: 'itemParameter', param: p }))

  return {
    name: name.param,
    listPrice: listPrice.param,
    price: price.param,
    description: description.param,
    brandSection: brandSection.param,
    stock: stock.param,
    isAvailable: isAvailable.param,
    media: media.param,
    primaryMedia: primaryMedia.param,
    userID: userID.param,
    categoryName: categoryName.param,
    vendorName: vendorName.param,
    groups: groups.param,
    itemParameters: itemParameters.param
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

  Array.isArray(object)
    ? object.map((item: object) => isImage({ name: 'image', param: item }))
    : isImage({ name: 'image', param: object })

  return object
}

const checkNewCategory = (object: any): CategoryCreateInput => {
  const name = R.pipe(
    isProvided,
    isString
  )({ name: 'name', param: object.name })

  const parentCategoryID = object.parentCategoryID && isNumber(
    { name: 'parentCategoryID', param: object.parentCategoryID }
  )

  const categoryInput = {
    name: name.param,
    parentCategoryID: parentCategoryID?.param
  }

  return hasDefinedProps(categoryInput)
}

const checkCategoryUpdate = (object: any): CategoryUpdateInput => {
  isInputProvided(object)

  const name = object.name && isString(
    { name: 'name', param: object.name }
  )

  const parentCategoryID = object.parentCategoryID && isNumber(
    { name: 'parentCategoryID', param: object.parentCategoryID }
  )

  const categoryInput = {
    name: name?.param,
    parentCategoryID: parentCategoryID?.param
  }

  return hasDefinedProps(categoryInput)
}

const checkNewVendor = (object: any): VendorInput => {
  const name = R.pipe(
    isProvided,
    isString
  )({ name: 'name', param: object.name })

  const vendorInput = {
    name: name.param
  }

  return hasDefinedProps(vendorInput)
}

const checkVendorUpdate = (object: any): VendorInput => {
  isInputProvided(object)

  const name = R.pipe(
    isProvided,
    isString
  )({ name: 'name', param: object.name })

  const vendorInput = {
    name: name.param
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
