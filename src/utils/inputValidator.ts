import { Request } from 'express'
import R from 'ramda'
import { AddressCreateInput, AddressTypeInput, AnswerCommentCreateInput, AnswerCommentUpdateInput, AnswerCreateInput, AnswerUpdateInput, CategoryCreateInput, CategoryUpdateInput, GroupCreateInput, GroupProductInput, GroupUpdateInput, ListCreateInput, ParameterCreateInput, ParameterUpdateInput, PasswordRequestInput, PasswordResetInput, ProductCreateInput, ProductParameterInput, ProductUpdateInput, QuestionCreateInput, QuestionUpdateInput, RatingCommentCreateInput, RatingCommentUpdateInput, RatingCreateInput, RatingUpdateInput, RoleInput, ShippingMethodInput, UserAddressCreateInput, UserAddressUpdateInput, UserLoginInput, UserSignupInput, UserUpdateInput, VendorInput, PaymentTypeInput, CartProduct, CartProductInput, OrderStatusInput, InvoiceStatusInput, OrderStatus, InvoiceStatus, OrderCreateInput } from '../types'
import { hasDefinedProps, isArray, isBoolean, isEmail, isInputProvided, isNumber, isPasswordValid, isProvided, isString, isStringOrArray, isStringOrNumber, isProductParameterOrGroupProduct, isCart } from './validatorLib'

export const checkNewUser = ({ body }: Request): UserSignupInput => {
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

  return {
    email: email.param.toLowerCase(),
    password: password.param
  }
}

export const checkUserLogin = ({ body }: Request): UserLoginInput => {
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

  return {
    email: email.param.toLowerCase(),
    password: password.param,
    remember: remember.param
  }
}

export const checkUserUpdate = ({ body }: Request): UserUpdateInput => {
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

  return hasDefinedProps({
    name: name?.param,
    email: email?.param.toLowerCase(),
    password: password?.param,
    avatar: avatar?.param,
    roleID: roleID?.param
  })
}

export const checkUserResetRequest = ({ body }: Request): PasswordRequestInput => {
  const email = R.pipe(
    isProvided,
    isString,
    isEmail
  )({ name: 'email', param: body.email })

  return { email: email.param.toLowerCase() }
}

export const checkUserResetToken = ({ body }: Request): PasswordResetInput => {
  const resetToken = R.pipe(
    isProvided,
    isString
  )({ name: 'resetToken', param: body.resetToken })

  const password = R.pipe(
    isProvided,
    isString,
    isPasswordValid
  )({ name: 'password', param: body.password })

  return {
    resetToken: resetToken.param,
    password: password.param
  }
}

export const checkNewProduct = ({ body }: Request): ProductCreateInput => {
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

  const groups = body.groups && isArray(
    { name: 'groups', param: body.groups }
  )

  groups && groups.param.map((g: any) => isProductParameterOrGroupProduct({ name: 'group', param: g }))

  const parameters = body.parameters && isArray(
    { name: 'parameters', param: body.parameters }
  )

  parameters && parameters.param.map((p: any) => isProductParameterOrGroupProduct({ name: 'parameter', param: p }))

  return {
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
    vendorID: vendorID.param,
    parameters: parameters?.param,
    groups: groups?.param
  }
}

export const checkProductUpdate = ({ body }: Request): ProductUpdateInput => {
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

  return hasDefinedProps({
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
  })
}

export const checkMediaUpload = ({ files }: Request): Express.Multer.File[] => {
  isInputProvided(files, 'Missing images')
  isStringOrArray({ name: 'images', param: files })
  return files as Express.Multer.File[]
}

export const checkNewCategory = ({ body }: Request): CategoryCreateInput => {
  const name = R.pipe(
    isProvided,
    isString
  )({ name: 'name', param: body.name })

  const parentCategoryID = body.parentCategoryID && isNumber(
    { name: 'parentCategoryID', param: body.parentCategoryID }
  )

  return {
    name: name.param,
    parentCategoryID: parentCategoryID?.param
  }
}

export const checkCategoryUpdate = ({ body }: Request): CategoryUpdateInput => {
  const name = body.name && isString(
    { name: 'name', param: body.name }
  )

  const parentCategoryID = body.parentCategoryID && isNumber(
    { name: 'parentCategoryID', param: body.parentCategoryID }
  )

  return hasDefinedProps({
    name: name?.param,
    parentCategoryID: parentCategoryID?.param
  })
}

export const checkVendor = ({ body }: Request): VendorInput => {
  const name = R.pipe(
    isProvided,
    isString
  )({ name: 'name', param: body.name })

  return { name: name.param }
}

export const checkRole = ({ body }: Request): RoleInput => {
  const name = R.pipe(
    isProvided,
    isString
  )({ name: 'name', param: body.name })

  return { name: name.param }
}

export const checkNewOrderStatus = ({ body }: Request): OrderStatusInput => {
  const name = R.pipe(
    isProvided,
    isString
  )({ name: 'name', param: body.name })

  return { name: name.param }
}

export const checkNewInvoiceStatus = ({ body }: Request): InvoiceStatusInput => {
  const name = R.pipe(
    isProvided,
    isString
  )({ name: 'name', param: body.name })

  return { name: name.param }
}

export const checkOrderStatusUpdate = ({ body }: Request): OrderStatusInput => {
  const name = R.pipe(
    isProvided,
    isString
  )({ name: 'name', param: body.name })

  return { name: name.param }
}

export const checkInvoiceStatusUpdate = ({ body }: Request): InvoiceStatusInput => {
  const name = R.pipe(
    isProvided,
    isString
  )({ name: 'name', param: body.name })

  return { name: name.param }
}

export const checkShippingMethod = ({ body }: Request): ShippingMethodInput => {
  const name = R.pipe(
    isProvided,
    isString
  )({ name: 'name', param: body.name })

  return { name: name.param }
}

export const checkAddressType = ({ body }: Request): AddressTypeInput => {
  const name = R.pipe(
    isProvided,
    isString
  )({ name: 'name', param: body.name })

  return { name: name.param }
}

export const checkNewCartProduct = ({ body }: Request): CartProduct => {
  const qty = R.pipe(
    isProvided,
    isNumber
  )({ name: 'qty', param: body.qty })

  const userID = R.pipe(
    isProvided,
    isNumber
  )({ name: 'userID', param: body.userID })

  const productID = R.pipe(
    isProvided,
    isNumber
  )({ name: 'productID', param: body.productID })

  return {
    qty: qty.param,
    userID: userID.param,
    productID: productID.param
  }
}

export const checkCartProductUpdate = ({ body }: Request): CartProductInput => {
  const qty = body.qty && isNumber(
    { name: 'qty', param: body.qty }
  )
  return { qty: qty.param }
}

export const checkPaymentType = ({ body }: Request): PaymentTypeInput => {
  const name = R.pipe(
    isProvided,
    isString
  )({ name: 'name', param: body.name })

  return { name: name.param }
}

export const checkNewAddress = ({ body }: Request): AddressCreateInput => {
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

  return {
    isDefault: isDefault?.param,
    addr: addr.param,
    addressTypeID: addressTypeID.param
  }
}

export const checkNewUserAddress = ({ body }: Request): UserAddressCreateInput => {
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

  return {
    isDefault: isDefault?.param,
    userID: userID.param,
    addressID: addressID.param
  }
}

export const checkUserAddressesUpdate = ({ body }: Request): UserAddressUpdateInput => {
  const isDefault = R.pipe(
    isProvided,
    isBoolean
  )({ name: 'isDefault', param: body.isDefault })

  return { isDefault: isDefault.param }
}

export const checkNewList = ({ body }: Request): ListCreateInput => {
  const name = R.pipe(
    isProvided,
    isString
  )({ name: 'name', param: body.name })

  return { name: name.param }
}

export const checkListUpdate = ({ body }: Request): ListCreateInput => {
  const name = R.pipe(
    isProvided,
    isString
  )({ name: 'name', param: body.name })

  return { name: name.param }
}

export const checkNewRating = ({ body }: Request): RatingCreateInput => {
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

  return {
    title: title?.param,
    review: review?.param,
    media: media?.param,
    stars: stars.param,
    productID: productID.param
  }
}

export const checkRatingUpdate = ({ body }: Request): RatingUpdateInput => {
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

  return hasDefinedProps({
    title: title?.param,
    review: review?.param,
    media: media?.param,
    stars: stars?.param
  })
}

export const checkNewRatingComment = ({ body }: Request): RatingCommentCreateInput => {
  const content = R.pipe(
    isProvided,
    isString
  )({ name: 'content', param: body.content })

  const media = body.media && isNumber(
    { name: 'media', param: body.media }
  )

  const ratingID = R.pipe(
    isProvided,
    isNumber
  )({ name: 'ratingID', param: body.ratingID })

  const parentRatingCommentID = body.media && isNumber(
    { name: 'parentRatingCommentID', param: body.parentRatingCommentID }
  )

  return {
    content: content.param,
    media: media?.param,
    ratingID: ratingID.param,
    parentRatingCommentID: parentRatingCommentID?.param
  }
}

export const checkRatingCommentUpdate = ({ body }: Request): RatingCommentUpdateInput => {
  const content = body.content && isString(
    { name: 'content', param: body.content }
  )

  const media = body.media && isNumber(
    { name: 'media', param: body.media }
  )

  return {
    content: content?.param,
    media: media?.param
  }
}

export const checkNewQuestion = ({ body }: Request): QuestionCreateInput => {
  const content = R.pipe(
    isProvided,
    isString
  )({ name: 'content', param: body.content })

  const media = body.media && isNumber(
    { name: 'media', param: body.media }
  )

  const productID = R.pipe(
    isProvided,
    isNumber
  )({ name: 'productID', param: body.productID })

  return {
    content: content.param,
    media: media?.param,
    productID: productID.param
  }
}

export const checkQuestionUpdate = ({ body }: Request): QuestionUpdateInput => {
  const content = body.content && isString(
    { name: 'content', param: body.content }
  )

  const media = body.media && isNumber(
    { name: 'media', param: body.media }
  )

  return hasDefinedProps({
    content: content?.param,
    media: media?.param
  })
}

export const checkNewAnswer = ({ body }: Request): AnswerCreateInput => {
  const content = R.pipe(
    isProvided,
    isString
  )({ name: 'content', param: body.content })

  const media = body.media && isNumber(
    { name: 'media', param: body.media }
  )

  const questionID = R.pipe(
    isProvided,
    isNumber
  )({ name: 'questionID', param: body.questionID })

  return {
    content: content.param,
    media: media?.param,
    questionID: questionID.param
  }
}

export const checkAnswerUpdate = ({ body }: Request): AnswerUpdateInput => {
  const content = body.content && isString(
    { name: 'content', param: body.content }
  )

  const media = body.media && isNumber(
    { name: 'media', param: body.media }
  )

  return {
    content: content?.param,
    media: media?.param
  }
}

export const checkNewAnswerComment = ({ body }: Request): AnswerCommentCreateInput => {
  const content = R.pipe(
    isProvided,
    isString
  )({ name: 'content', param: body.content })

  const media = body.media && isNumber(
    { name: 'media', param: body.media }
  )

  const answerID = R.pipe(
    isProvided,
    isNumber
  )({ name: 'answerID', param: body.answerID })

  const parentAnswerCommentID = body.media && isNumber(
    { name: 'parentAnswerCommentID', param: body.parentAnswerCommentID }
  )

  return {
    content: content.param,
    media: media?.param,
    answerID: answerID.param,
    parentAnswerCommentID: parentAnswerCommentID?.param
  }
}

export const checkAnswerCommentUpdate = ({ body }: Request): AnswerCommentUpdateInput => {
  const content = body.content && isString(
    { name: 'content', param: body.content }
  )

  const media = body.media && isNumber(
    { name: 'media', param: body.media }
  )

  return {
    content: content?.param,
    media: media?.param
  }
}

export const checkNewParameters = ({ body }: Request): ParameterCreateInput => {
  const names = R.pipe(
    isProvided,
    isArray
  )({ name: 'parameter names', param: body })

  names.param.map((p: any) => isStringOrNumber({ name: 'parameter name', param: p.name }))

  return names.param
}

export const checkParameterUpdate = ({ body }: Request): ParameterUpdateInput => {
  const name = R.pipe(
    isProvided,
    isString
  )({ name: 'name', param: body.name })

  return { name: name.param }
}

export const checkNewGroups = ({ body }: Request): GroupCreateInput => {
  const names = R.pipe(
    isProvided,
    isArray
  )({ name: 'group names', param: body })

  names.param.map((p: any) => isStringOrNumber({ name: 'group name', param: p.name }))

  return names.param
}

export const checkGroupUpdate = ({ body }: Request): GroupUpdateInput => {
  const name = R.pipe(
    isProvided,
    isString
  )({ name: 'name', param: body.name })

  return { name: name.param }
}

export const checkGroupProduct = ({ body }: Request): GroupProductInput => {
  const value = R.pipe(
    isProvided,
    isString
  )({ name: 'value', param: body.value })

  return { value: value.param }
}

export const checkProductParameter = ({ body }: Request): ProductParameterInput => {
  const value = R.pipe(
    isProvided,
    isString
  )({ name: 'value', param: body.value })

  return { value: value.param }
}

export const checkNewOrder = ({ body }: Request): OrderCreateInput => {
  const address = R.pipe(
    isProvided,
    isString
  )({ name: 'address', param: body.address })

  const shippingMethodID = R.pipe(
    isProvided,
    isNumber
  )({ name: 'shippingMethodID', param: body.shippingMethodID })

  const userID = R.pipe(
    isProvided,
    isNumber
  )({ name: 'userID', param: body.userID })

  const cart = R.pipe(
    isProvided,
    isArray
  )({ name: 'cart', param: body.cart })

  cart.param.map((cp: any) => {
    isNumber({ name: 'productID', param: cp.productID })
    isNumber({ name: 'userID', param: cp.userID })
    isNumber({ name: 'qty', param: cp.qty })
  })

  return {
    address: address.param,
    userID: userID.param,
    shippingMethodID: shippingMethodID.param,
    cart: cart.param
  }
}

export const checkOrderUpdate = ({ body }: Request): OrderCreateInput => {
  const address = body.address && isString(
    { name: 'address', param: body.address }
  )

  const orderStatusID = body.orderStatusID && isNumber(
    { name: 'orderStatusID', param: body.orderStatusID }
  )

  const shippingMethodID = body.shippingMethodID && isNumber(
    { name: 'shippingMethodID', param: body.shippingMethodID }
  )

  return hasDefinedProps({
    address: address?.param,
    orderStatusID: orderStatusID?.param,
    shippingMethodID: shippingMethodID?.param
  })
}
