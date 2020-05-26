import { ItemUpdateInput } from '@prisma/client'
import R from 'ramda'
import { AddressCreateInput, AddressFetchInput, AddressTypeInput, CategoryCreateInput, CategoryUpdateInput, Follower, FollowerFetchInput, ItemCreateInputRaw, ListCreateInput, ListFetchInput, PasswordRequestInput, PasswordResetInput, RoleInput, ShippingMethodInput, UserAddressCreateInput, UserAddressFetchInput, UserAddressUpdateInput, UserLoginInput, UserSignupInput, UserUpdateInput, VendorInput } from '../types'
import { canBeNumber, hasDefinedProps, isArray, isBoolean, isEmail, isGroup, isImage, isInputProvided, isItemParameter, isNumber, isPasswordValid, isProvided, isString, isStringOrArray } from './validatorLib'

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

  const userInput: UserSignupInput = {
    email: email.param.toLowerCase(),
    password: password.param
  }
  return userInput
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

  const userInput: UserLoginInput = {
    email: email.param.toLowerCase(),
    password: password.param,
    remember: remember.param
  }
  return userInput
}

const checkUserUpdate = (object: any): UserUpdateInput => {
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

  const userInput: UserUpdateInput = {
    name: name?.param,
    email: email?.param.toLowerCase(),
    password: password?.param,
    avatar: avatar?.param,
    roleID: roleID?.param
  }
  return hasDefinedProps(userInput)
}

const checkUserResetRequest = (object: any): PasswordRequestInput => {
  const email = R.pipe(
    isProvided,
    isString,
    isEmail
  )({ name: 'email', param: object.email })

  const userInput: PasswordRequestInput = {
    email: email.param.toLowerCase()
  }
  return userInput
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

  const userInput: PasswordResetInput = {
    resetToken: resetToken.param,
    password: password.param
  }
  return userInput
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

  const userInput: ItemCreateInputRaw = {
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
  return userInput
}

const checkItemUpdate = (object: any): ItemUpdateInput => {
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

  const categoryInput: CategoryCreateInput = {
    name: name.param,
    parentCategoryID: parentCategoryID?.param
  }
  return categoryInput
}

const checkCategoryUpdate = (object: any): CategoryUpdateInput => {
  const name = object.name && isString(
    { name: 'name', param: object.name }
  )

  const parentCategoryID = object.parentCategoryID && isNumber(
    { name: 'parentCategoryID', param: object.parentCategoryID }
  )

  const categoryInput: CategoryUpdateInput = {
    name: name?.param,
    parentCategoryID: parentCategoryID?.param
  }
  return hasDefinedProps(categoryInput)
}

const checkVendor = (object: any): VendorInput => {
  const name = R.pipe(
    isProvided,
    isString
  )({ name: 'name', param: object.name })

  const vendorInput: VendorInput = {
    name: name.param
  }
  return vendorInput
}

const checkRole = (object: any): RoleInput => {
  const name = R.pipe(
    isProvided,
    isString
  )({ name: 'name', param: object.name })

  const roleInput: RoleInput = {
    name: name.param
  }
  return roleInput
}

const checkShippingMethod = (object: any): ShippingMethodInput => {
  const name = R.pipe(
    isProvided,
    isString
  )({ name: 'name', param: object.name })

  const shippingMethodID: ShippingMethodInput = {
    name: name.param
  }
  return shippingMethodID
}

const checkAddressType = (object: any): AddressTypeInput => {
  const name = R.pipe(
    isProvided,
    isString
  )({ name: 'name', param: object.name })

  const addressTypeInput: AddressTypeInput = {
    name: name.param
  }
  return addressTypeInput
}

const checkNewAddress = (object: any): AddressCreateInput => {
  const isDefault = object.isDefault && isBoolean(
    { name: 'isDefault', param: object.isDefault }
  )

  const addr = R.pipe(
    isProvided,
    isString
  )({ name: 'addr', param: object.addr })

  const addressTypeID = R.pipe(
    isProvided,
    isNumber
  )({ name: 'addressTypeID', param: object.addressTypeID })

  const addressInput: AddressCreateInput = {
    isDefault: isDefault?.param,
    addr: addr.param,
    addressTypeID: addressTypeID.param
  }
  return addressInput
}

const checkAddressesFetch = (object: any): AddressFetchInput => {
  const userID = object.userID && canBeNumber(
    { name: 'userID', param: object.userID }
  )

  const addressTypeID = object.addressTypeID && canBeNumber(
    { name: 'addressTypeID', param: object.addressTypeID }
  )

  const addressInput: AddressFetchInput = {
    userID: parseInt(userID?.param),
    addressTypeID: parseInt(addressTypeID?.param)
  }
  return hasDefinedProps(addressInput)
}

const checkNewFollower = (object: any): Follower => {
  const userID = R.pipe(
    isProvided,
    isNumber
  )({ name: 'userID', param: object.userID })

  const follows = R.pipe(
    isProvided,
    isNumber
  )({ name: 'follows', param: object.follows })

  const followerInput: Follower = {
    userID: userID.param,
    follows: follows.param
  }
  return followerInput
}

const checkFollowersFetch = (object: any): FollowerFetchInput => {
  const userID = object.userID && canBeNumber(
    { name: 'userID', param: object.userID }
  )

  const follows = object.follows && canBeNumber(
    { name: 'follows', param: object.follows }
  )

  const followerInput: FollowerFetchInput = {
    userID: parseInt(userID?.param),
    follows: parseInt(follows?.param)
  }
  return hasDefinedProps(followerInput)
}

const checkNewUserAddress = (object: any): UserAddressCreateInput => {
  const isDefault = object.isDefault && isBoolean(
    { name: 'isDefault', param: object.isDefault }
  )

  const userID = R.pipe(
    isProvided,
    isNumber
  )({ name: 'userID', param: object.userID })

  const addressID = R.pipe(
    isProvided,
    isNumber
  )({ name: 'addressID', param: object.addressID })

  const userAddressInput: UserAddressCreateInput = {
    isDefault: isDefault?.param,
    userID: userID.param,
    addressID: addressID.param
  }
  return userAddressInput
}

const checkUserAddressesFetch = (object: any): UserAddressFetchInput => {
  const userID = R.pipe(
    isProvided,
    canBeNumber
  )({ name: 'userID', param: object.userID })

  const userAddressInput: UserAddressFetchInput = {
    userID: parseInt(userID.param)
  }
  return userAddressInput
}

const checkUpdateUserAddresses = (object: any): UserAddressUpdateInput => {
  const isDefault = R.pipe(
    isProvided,
    isBoolean
  )({ name: 'isDefault', param: object.isDefault })

  const userAddressInput: UserAddressUpdateInput = {
    isDefault: isDefault.param
  }
  return userAddressInput
}

const checkNewList = (object: any): ListCreateInput => {
  const name = R.pipe(
    isProvided,
    isString
  )({ name: 'name', param: object.name })

  const vendorInput: ListCreateInput = {
    name: name.param
  }
  return vendorInput
}

const checkListsFetch = (object: any): ListFetchInput => {
  const userID = R.pipe(
    isProvided,
    canBeNumber
  )({ name: 'userID', param: object.userID })

  const listInput: ListFetchInput = {
    userID: parseInt(userID.param)
  }
  return listInput
}

const checkListUpdate = (object: any): ListCreateInput => {
  const name = R.pipe(
    isProvided,
    isString
  )({ name: 'name', param: object.name })

  const listInput: ListCreateInput = {
    name: name.param
  }
  return listInput
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
  checkVendor,
  checkRole,
  checkShippingMethod,
  checkAddressType,
  checkNewAddress,
  checkAddressesFetch,
  checkNewFollower,
  checkFollowersFetch,
  checkNewUserAddress,
  checkUserAddressesFetch,
  checkUpdateUserAddresses,
  checkNewList,
  checkListsFetch,
  checkListUpdate
}
