import R from 'ramda'
import { AddressCreateInput, AddressFetchInput, AddressTypeInput, CategoryCreateInput, CategoryUpdateInput, Follower, FollowerFetchInput, ListCreateInput, ListFetchInput, PasswordRequestInput, PasswordResetInput, ProductCreateInput, ProductUpdateInput, RatingCreateInput, RatingUpdateInput, RoleInput, ShippingMethodInput, UserAddressCreateInput, UserAddressFetchInput, UserAddressUpdateInput, UserLoginInput, UserSignupInput, UserUpdateInput, VendorInput } from '../types'
import { canBeNumber, hasDefinedProps, isBoolean, isEmail, isInputProvided, isNumber, isPasswordValid, isProvided, isString, isStringOrArray } from './validatorLib'
import { Request } from 'express'

const checkNewUser = ({ body }: Request): UserSignupInput => {
  const email = R.pipe(
    isProvided,
    isString,
    isEmail
  )({ name: 'email', param: body.email })

  const password = R.pipe(
    isProvided,
    isString,
    isPasswordValid
  )({ name: 'password', param: body.password })

  const userInput: UserSignupInput = {
    email: email.param.toLowerCase(),
    password: password.param
  }
  return userInput
}

const checkUserLogin = ({ body }: Request): UserLoginInput => {
  const email = R.pipe(
    isProvided,
    isString,
    isEmail
  )({ name: 'email', param: body.email })

  const password = R.pipe(
    isProvided,
    isString
  )({ name: 'password', param: body.password })

  const remember = R.pipe(
    isProvided,
    isBoolean
  )({ name: 'remember', param: body.remember })

  const userInput: UserLoginInput = {
    email: email.param.toLowerCase(),
    password: password.param,
    remember: remember.param
  }
  return userInput
}

const checkUserUpdate = ({ body }: Request): UserUpdateInput => {
  const password = body.password && R.pipe(
    isString,
    isPasswordValid
  )({ name: 'password', param: body.password })

  const email = body.email && R.pipe(
    isString,
    isEmail
  )({ name: 'email', param: body.email })

  const name = body.name && isString(
    { name: 'name', param: body.name }
  )

  const avatar = body.avatar && isBoolean(
    { name: 'avatar', param: body.avatar }
  )

  const roleID = body.roleID && isNumber(
    { name: 'roleID', param: body.roleID }
  )

  const isDeleted = body.isDeleted && isBoolean(
    { name: 'isDeleted', param: body.isDeleted }
  )

  const userInput: UserUpdateInput = {
    name: name?.param,
    email: email?.param.toLowerCase(),
    password: password?.param,
    avatar: avatar?.param,
    isDeleted: isDeleted?.param,
    roleID: roleID?.param
  }
  return hasDefinedProps(userInput)
}

const checkUserResetRequest = ({ body }: Request): PasswordRequestInput => {
  const email = R.pipe(
    isProvided,
    isString,
    isEmail
  )({ name: 'email', param: body.email })

  const userInput: PasswordRequestInput = {
    email: email.param.toLowerCase()
  }
  return userInput
}

const checkUserResetToken = ({ body }: Request): PasswordResetInput => {
  const resetToken = R.pipe(
    isProvided,
    isString
  )({ name: 'resetToken', param: body.resetToken })

  const password = R.pipe(
    isProvided,
    isString,
    isPasswordValid
  )({ name: 'password', param: body.password })

  const userInput: PasswordResetInput = {
    resetToken: resetToken.param,
    password: password.param
  }
  return userInput
}

const checkNewProduct = ({ body }: Request): ProductCreateInput => {
  const title = R.pipe(
    isProvided,
    isString
  )({ name: 'title', param: body.title })

  const listPrice = R.pipe(
    isProvided,
    isNumber
  )({ name: 'listPrice', param: body.listPrice })

  const price = R.pipe(
    isProvided,
    isNumber
  )({ name: 'price', param: body.price })

  const description = R.pipe(
    isProvided,
    isString
  )({ name: 'description', param: body.description })

  const brandSection = body.brandSection && isString(
    { name: 'brandSection', param: body.brandSection }
  )

  const stock = R.pipe(
    isProvided,
    isNumber
  )({ name: 'stock', param: body.stock })

  const media = R.pipe(
    isProvided,
    isNumber
  )({ name: 'media', param: body.media })

  const primaryMedia = R.pipe(
    isProvided,
    isNumber
  )({ name: 'primaryMedia', param: body.primaryMedia })

  const isAvailable = body.isAvailable && isBoolean(
    { name: 'isAvailable', param: body.isAvailable }
  )

  const categoryID = R.pipe(
    isProvided,
    isNumber
  )({ name: 'categoryID', param: body.categoryID })

  const vendorID = R.pipe(
    isProvided,
    isNumber
  )({ name: 'vendorID', param: body.vendorID })

  // const groups = R.pipe(
  //   isProvided,
  //   isArray
  // )({ name: 'groups', param: body.groups })

  // groups.param.map((p: body) =>
  //   isGroup({ name: 'productParameter', param: p }))

  // const productParameters = R.pipe(
  //   isProvided,
  //   isArray
  // )({ name: 'productParameters', param: body.productParameters })

  // productParameters.param.map((p: body) =>
  //   isProductParameter({ name: 'productParameter', param: p }))

  const productInput: ProductCreateInput = {
    title: title.param,
    listPrice: listPrice.param,
    price: price.param,
    description: description.param,
    brandSection: brandSection?.param,
    stock: stock.param,
    isAvailable: isAvailable?.param,
    media: media.param,
    primaryMedia: primaryMedia.param,
    categoryID: categoryID.param,
    vendorID: vendorID.param
    // groups: groups.param,
    // productParameters: productParameters.param
  }
  return productInput
}

const checkProductUpdate = ({ body }: Request): ProductUpdateInput => {
  const title = body.title && isString(
    { name: 'title', param: body.title }
  )

  const listPrice = body.listPrice && isNumber(
    { name: 'listPrice', param: body.listPrice }
  )

  const price = body.price && isNumber(
    { name: 'price', param: body.price }
  )

  const description = body.description && isString(
    { name: 'description', param: body.description }
  )

  const brandSection = body.brandSection && isString(
    { name: 'brandSection', param: body.brandSection }
  )

  const stock = body.stock && isNumber(
    { name: 'stock', param: body.stock }
  )

  const media = body.media && isNumber(
    { name: 'media', param: body.media }
  )

  const primaryMedia = body.primaryMedia && isNumber(
    { name: 'primaryMedia', param: body.primaryMedia }
  )

  const isAvailable = body.isAvailable && isBoolean(
    { name: 'isAvailable', param: body.isAvailable }
  )

  const categoryID = body.categoryID && isNumber(
    { name: 'categoryID', param: body.categoryID }
  )

  const vendorID = body.vendorID && isNumber(
    { name: 'vendorID', param: body.vendorID }
  )

  const isDeleted = body.isDeleted && isBoolean(
    { name: 'isDeleted', param: body.isDeleted }
  )

  const productInput: ProductUpdateInput = {
    title: title?.param,
    listPrice: listPrice?.param,
    price: price?.param,
    description: description?.param,
    brandSection: brandSection?.param,
    stock: stock?.param,
    media: media?.param,
    primaryMedia: primaryMedia?.param,
    isAvailable: isAvailable?.param,
    isDeleted: isDeleted?.param,
    categoryID: categoryID?.param,
    vendorID: vendorID?.param
  }
  return hasDefinedProps(productInput)
}

const checkProductMediaUpload = ({ files }: Request): Express.Multer.File[] => {
  isInputProvided(files, 'Missing images')
  isStringOrArray({ name: 'images', param: files })
  return files as Express.Multer.File[]
}

const checkNewCategory = ({ body }: Request): CategoryCreateInput => {
  const name = R.pipe(
    isProvided,
    isString
  )({ name: 'name', param: body.name })

  const parentCategoryID = body.parentCategoryID && isNumber(
    { name: 'parentCategoryID', param: body.parentCategoryID }
  )

  const categoryInput: CategoryCreateInput = {
    name: name.param,
    parentCategoryID: parentCategoryID?.param
  }
  return categoryInput
}

const checkCategoryUpdate = ({ body }: Request): CategoryUpdateInput => {
  const name = body.name && isString(
    { name: 'name', param: body.name }
  )

  const parentCategoryID = body.parentCategoryID && isNumber(
    { name: 'parentCategoryID', param: body.parentCategoryID }
  )

  const categoryInput: CategoryUpdateInput = {
    name: name?.param,
    parentCategoryID: parentCategoryID?.param
  }
  return hasDefinedProps(categoryInput)
}

const checkVendor = ({ body }: Request): VendorInput => {
  const name = R.pipe(
    isProvided,
    isString
  )({ name: 'name', param: body.name })

  const vendorInput: VendorInput = {
    name: name.param
  }
  return vendorInput
}

const checkRole = ({ body }: Request): RoleInput => {
  const name = R.pipe(
    isProvided,
    isString
  )({ name: 'name', param: body.name })

  const roleInput: RoleInput = {
    name: name.param
  }
  return roleInput
}

const checkShippingMethod = ({ body }: Request): ShippingMethodInput => {
  const name = R.pipe(
    isProvided,
    isString
  )({ name: 'name', param: body.name })

  const shippingMethodID: ShippingMethodInput = {
    name: name.param
  }
  return shippingMethodID
}

const checkAddressType = ({ body }: Request): AddressTypeInput => {
  const name = R.pipe(
    isProvided,
    isString
  )({ name: 'name', param: body.name })

  const addressTypeInput: AddressTypeInput = {
    name: name.param
  }
  return addressTypeInput
}

const checkNewAddress = ({ body }: Request): AddressCreateInput => {
  const isDefault = body.isDefault && isBoolean(
    { name: 'isDefault', param: body.isDefault }
  )

  const addr = R.pipe(
    isProvided,
    isString
  )({ name: 'addr', param: body.addr })

  const addressTypeID = R.pipe(
    isProvided,
    isNumber
  )({ name: 'addressTypeID', param: body.addressTypeID })

  const addressInput: AddressCreateInput = {
    isDefault: isDefault?.param,
    addr: addr.param,
    addressTypeID: addressTypeID.param
  }
  return addressInput
}

const checkNewUserAddress = ({ body }: Request): UserAddressCreateInput => {
  const isDefault = body.isDefault && isBoolean(
    { name: 'isDefault', param: body.isDefault }
  )

  const userID = R.pipe(
    isProvided,
    isNumber
  )({ name: 'userID', param: body.userID })

  const addressID = R.pipe(
    isProvided,
    isNumber
  )({ name: 'addressID', param: body.addressID })

  const userAddressInput: UserAddressCreateInput = {
    isDefault: isDefault?.param,
    userID: userID.param,
    addressID: addressID.param
  }
  return userAddressInput
}

const checkUserAddressesUpdate = ({ body }: Request): UserAddressUpdateInput => {
  const isDefault = R.pipe(
    isProvided,
    isBoolean
  )({ name: 'isDefault', param: body.isDefault })

  const userAddressInput: UserAddressUpdateInput = {
    isDefault: isDefault.param
  }
  return userAddressInput
}

const checkNewList = ({ body }: Request): ListCreateInput => {
  const name = R.pipe(
    isProvided,
    isString
  )({ name: 'name', param: body.name })

  const vendorInput: ListCreateInput = {
    name: name.param
  }
  return vendorInput
}

const checkListUpdate = ({ body }: Request): ListCreateInput => {
  const name = R.pipe(
    isProvided,
    isString
  )({ name: 'name', param: body.name })

  const listInput: ListCreateInput = {
    name: name.param
  }
  return listInput
}

const checkNewRating = ({ body }: Request): RatingCreateInput => {
  const title = body.title && isString(
    { name: 'title', param: body.title }
  )

  const review = body.review && isString(
    { name: 'review', param: body.review }
  )

  const media = body.media && isNumber(
    { name: 'media', param: body.media }
  )

  const stars = R.pipe(
    isProvided,
    isNumber
  )({ name: 'stars', param: body.stars })

  const productID = R.pipe(
    isProvided,
    isNumber
  )({ name: 'productID', param: body.productID })

  const ratingInput: RatingCreateInput = {
    title: title?.param,
    review: review?.param,
    media: media?.param,
    stars: stars.param,
    productID: parseInt(productID.param)
  }
  return ratingInput
}

const checkRatingUpdate = ({ body }: Request): RatingUpdateInput => {
  const title = body.title && isString(
    { name: 'title', param: body.title }
  )

  const review = body.review && isString(
    { name: 'review', param: body.review }
  )

  const media = body.media && isNumber(
    { name: 'media', param: body.media }
  )

  const stars = body.review && isNumber(
    { name: 'stars', param: body.stars }
  )

  const isDeleted = body.isDeleted && isBoolean(
    { name: 'isDeleted', param: body.isDeleted }
  )

  const ratingInput: RatingUpdateInput = {
    title: title?.param,
    review: review?.param,
    media: media?.param,
    stars: stars?.param,
    isDeleted: isDeleted?.param
  }
  return hasDefinedProps(ratingInput)
}

export default {
  checkNewUser,
  checkUserLogin,
  checkUserUpdate,
  checkUserResetRequest,
  checkUserResetToken,
  checkNewProduct,
  checkProductUpdate,
  checkProductMediaUpload,
  checkNewCategory,
  checkCategoryUpdate,
  checkVendor,
  checkRole,
  checkShippingMethod,
  checkAddressType,
  checkNewAddress,
  checkNewUserAddress,
  checkUserAddressesUpdate,
  checkNewList,
  checkListUpdate,
  checkNewRating,
  checkRatingUpdate
}
