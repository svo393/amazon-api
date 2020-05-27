import R from 'ramda'
import { AddressCreateInput, AddressFetchInput, AddressTypeInput, CategoryCreateInput, CategoryUpdateInput, Follower, FollowerFetchInput, ListCreateInput, ListFetchInput, PasswordRequestInput, PasswordResetInput, RoleInput, ShippingMethodInput, UserAddressCreateInput, UserAddressFetchInput, UserAddressUpdateInput, UserLoginInput, UserSignupInput, UserUpdateInput, VendorInput, ProductCreateInput, ProductUpdateInput, ListProduct, ListProductFetchInput, RatingCreateInput } from '../types'
import { canBeNumber, hasDefinedProps, isArray, isBoolean, isEmail, isGroup, isImage, isInputProvided, isNumber, isPasswordValid, isProductParameter, isProvided, isString, isStringOrArray } from './validatorLib'

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

const checkNewProduct = (object: any): ProductCreateInput => {
  const title = R.pipe(
    isProvided,
    isString
  )({ name: 'title', param: object.title })

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

  const brandSection = object.brandSection && isString(
    { name: 'brandSection', param: object.brandSection }
  )

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

  const isAvailable = object.isAvailable && isBoolean(
    { name: 'isAvailable', param: object.isAvailable }
  )

  const categoryID = R.pipe(
    isProvided,
    isNumber
  )({ name: 'categoryID', param: object.categoryID })

  const vendorID = R.pipe(
    isProvided,
    isNumber
  )({ name: 'vendorID', param: object.vendorID })

  // const groups = R.pipe(
  //   isProvided,
  //   isArray
  // )({ name: 'groups', param: object.groups })

  // groups.param.map((p: object) =>
  //   isGroup({ name: 'productParameter', param: p }))

  // const productParameters = R.pipe(
  //   isProvided,
  //   isArray
  // )({ name: 'productParameters', param: object.productParameters })

  // productParameters.param.map((p: object) =>
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

const checkProductUpdate = (object: any): ProductUpdateInput => {
  const title = object.title && isString(
    { name: 'title', param: object.title }
  )

  const listPrice = object.listPrice && isNumber(
    { name: 'listPrice', param: object.listPrice }
  )

  const price = object.price && isNumber(
    { name: 'price', param: object.price }
  )

  const description = object.description && isString(
    { name: 'description', param: object.description }
  )

  const brandSection = object.brandSection && isString(
    { name: 'brandSection', param: object.brandSection }
  )

  const stock = object.stock && isNumber(
    { name: 'stock', param: object.stock }
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

  const categoryID = object.categoryID && isNumber(
    { name: 'categoryID', param: object.categoryID }
  )

  const vendorID = object.vendorID && isNumber(
    { name: 'vendorID', param: object.vendorID }
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
    categoryID: categoryID?.param,
    vendorID: vendorID?.param
  }
  return hasDefinedProps(productInput)
}

const checkProductMediaUpload = (object: any): Express.Multer.File[] => {
  isInputProvided(object, 'Missing images')
  isStringOrArray({ name: 'images', param: object })
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

const checkUserAddressesUpdate = (object: any): UserAddressUpdateInput => {
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

const checkListProduct = (object: any): ListProduct => {
  const listID = R.pipe(
    isProvided,
    isNumber
  )({ name: 'listID', param: object.listID })

  const productID = R.pipe(
    isProvided,
    isNumber
  )({ name: 'productID', param: object.productID })

  const listProductInput: ListProduct = {
    listID: listID.param,
    productID: productID.param
  }
  return listProductInput
}

const checkListProductsFetch = (object: any): ListProductFetchInput => {
  const listID = R.pipe(
    isProvided,
    canBeNumber
  )({ name: 'listID', param: object.listID })

  const listProductInput: ListProductFetchInput = {
    listID: parseInt(listID.param)
  }
  return listProductInput
}

const checkNewRating = (object: any): RatingCreateInput => {
  const title = object.title && isString(
    { name: 'title', param: object.title }
  )

  const review = object.review && isString(
    { name: 'review', param: object.review }
  )

  const media = object.media && isNumber(
    { name: 'media', param: object.media }
  )

  const stars = R.pipe(
    isProvided,
    isNumber
  )({ name: 'stars', param: object.stars })

  const productID = R.pipe(
    isProvided,
    isNumber
  )({ name: 'productID', param: object.productID })

  const ratingInput: RatingCreateInput = {
    title: title?.param,
    review: review?.param,
    media: media?.param,
    stars: stars.param,
    productID: parseInt(productID.param)
  }
  return ratingInput
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
  checkAddressesFetch,
  checkNewFollower,
  checkFollowersFetch,
  checkNewUserAddress,
  checkUserAddressesFetch,
  checkUserAddressesUpdate,
  checkNewList,
  checkListsFetch,
  checkListUpdate,
  checkListProduct,
  checkListProductsFetch,
  checkNewRating
}
