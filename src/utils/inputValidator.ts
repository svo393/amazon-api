import { Request } from 'express'
import R from 'ramda'
import { AddressCreateInput, AddressTypeInput, AnswerCommentCreateInput, AnswerCommentUpdateInput, AnswerCreateInput, AnswerUpdateInput, CartProduct, CartProductInput, CategoryCreateInput, CategoryUpdateInput, GroupVariantCreateInput, GroupVariantUpdateInput, InvoiceCreateInput, InvoiceStatusInput, InvoiceUpdateInput, ListCreateInput, OrderCreateInput, OrderProductCreateInput, OrderProductUpdateInput, OrderStatusInput, ParameterCreateInput, ParameterUpdateInput, PasswordRequestInput, PasswordResetInput, PaymentMethodInput, ProductCreateInput, ProductParameterInput, ProductUpdateInput, QuestionCreateInput, QuestionUpdateInput, RatingCommentCreateInput, RatingCommentUpdateInput, RatingCreateInput, RatingUpdateInput, RoleInput, ShippingMethodInput, UserAddressCreateInput, UserAddressUpdateInput, UserLoginInput, UserSignupInput, UserUpdateInput, VendorInput } from '../types'
import { canBeNumber, hasDefinedProps, isArray, isBoolean, isEmail, isInputProvided, isPasswordValid, isProductParameterOrGroupVariant, isProvided, isString, isStringOrNumber } from './validatorLib'

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

  const info = body.info && isString(
    { name: 'info', param: body.info }
  )

  const avatar = 'avatar' in body
    ? isBoolean({ name: 'avatar', param: body.avatar })
    : undefined

  const roleID = body.roleID && canBeNumber(
    { name: 'roleID', param: body.roleID }
  )

  return hasDefinedProps({
    name: name?.param,
    info: info?.param,
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
    canBeNumber
  )({ name: 'listPrice', param: body.listPrice })

  const price = R.pipe(
    isProvided,
    canBeNumber
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
    canBeNumber
  )({ name: 'stock', param: body.stock })

  const media = R.pipe(
    isProvided,
    canBeNumber
  )({ name: 'media', param: body.media })

  const primaryMedia = R.pipe(
    isProvided,
    canBeNumber
  )({ name: 'primaryMedia', param: body.primaryMedia })

  const isAvailable = 'isAvailable' in body
    ? isBoolean({ name: 'isAvailable', param: body.isAvailable })
    : undefined

  const categoryID = R.pipe(
    isProvided,
    canBeNumber
  )({ name: 'categoryID', param: body.categoryID })

  const vendorID = R.pipe(
    isProvided,
    canBeNumber
  )({ name: 'vendorID', param: body.vendorID })

  const groupID = body.groupID && canBeNumber(
    { name: 'groupID', param: body.groupID }
  )

  const variants = body.variants && isArray(
    { name: 'variants', param: body.variants }
  )

  variants && variants.param.map((v: any) => isProductParameterOrGroupVariant({ name: 'group', param: v }))

  const parameters = body.parameters && isArray(
    { name: 'parameters', param: body.parameters }
  )

  parameters && parameters.param.map((p: any) => isProductParameterOrGroupVariant({ name: 'parameter', param: p }))

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
    groupID: groupID?.param,
    variants: variants?.param,
    parameters: parameters?.param
  }
}

export const checkProductUpdate = ({ body }: Request): ProductUpdateInput => {
  const title = body.title && isString(
    { name: 'title', param: body.title }
  )

  const listPrice = body.listPrice && canBeNumber(
    { name: 'listPrice', param: body.listPrice }
  )

  const price = body.price && canBeNumber(
    { name: 'price', param: body.price }
  )

  const description = body.description && isString(
    { name: 'description', param: body.description }
  )

  const brandSection = body.brandSection && isString(
    { name: 'brandSection', param: body.brandSection }
  )

  const stock = body.stock && canBeNumber(
    { name: 'stock', param: body.stock }
  )

  const media = body.media && canBeNumber(
    { name: 'media', param: body.media }
  )

  const primaryMedia = body.primaryMedia && canBeNumber(
    { name: 'primaryMedia', param: body.primaryMedia }
  )

  const isAvailable = 'isAvailable' in body
    ? isBoolean({ name: 'isAvailable', param: body.isAvailable })
    : undefined

  const categoryID = body.categoryID && canBeNumber(
    { name: 'categoryID', param: body.categoryID }
  )

  const vendorID = body.vendorID && canBeNumber(
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
  isArray({ name: 'images', param: files })
  return files as Express.Multer.File[]
}

export const checkSingleMediaUpload = ({ file }: Request): Express.Multer.File => {
  isInputProvided(file, 'Missing image')
  return file
}

export const checkNewCategory = ({ body }: Request): CategoryCreateInput => {
  const name = R.pipe(
    isProvided,
    isString
  )({ name: 'name', param: body.name })

  const parentCategoryID = body.parentCategoryID && canBeNumber(
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

  const parentCategoryID = body.parentCategoryID && canBeNumber(
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
    canBeNumber
  )({ name: 'qty', param: body.qty })

  const userID = R.pipe(
    isProvided,
    canBeNumber
  )({ name: 'userID', param: body.userID })

  const productID = R.pipe(
    isProvided,
    canBeNumber
  )({ name: 'productID', param: body.productID })

  return {
    qty: qty.param,
    userID: userID.param,
    productID: productID.param
  }
}

export const checkCartProductUpdate = ({ body }: Request): CartProductInput => {
  const qty = R.pipe(
    isProvided,
    canBeNumber
  )({ name: 'qty', param: body.qty })
  return { qty: qty.param }
}

export const checkPaymentMethod = ({ body }: Request): PaymentMethodInput => {
  const name = R.pipe(
    isProvided,
    isString
  )({ name: 'name', param: body.name })

  return { name: name.param }
}

export const checkNewAddress = ({ body }: Request): AddressCreateInput => {
  const isDefault = 'isDefault' in body
    ? isBoolean({ name: 'isDefault', param: body.isDefault })
    : undefined

  const addr = R.pipe(
    isProvided,
    isString
  )({ name: 'addr', param: body.addr })

  const addressTypeID = R.pipe(
    isProvided,
    canBeNumber
  )({ name: 'addressTypeID', param: body.addressTypeID })

  return {
    isDefault: isDefault?.param,
    addr: addr.param,
    addressTypeID: addressTypeID.param
  }
}

export const checkNewUserAddress = ({ body }: Request): UserAddressCreateInput => {
  const isDefault = 'isDefault' in body
    ? isBoolean({ name: 'isDefault', param: body.isDefault })
    : undefined

  const userID = R.pipe(
    isProvided,
    canBeNumber
  )({ name: 'userID', param: body.userID })

  const addressID = R.pipe(
    isProvided,
    canBeNumber
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

  const media = body.media && canBeNumber(
    { name: 'media', param: body.media }
  )

  const stars = R.pipe(
    isProvided,
    canBeNumber
  )({ name: 'stars', param: body.stars })

  const groupID = R.pipe(
    isProvided,
    canBeNumber
  )({ name: 'groupID', param: body.groupID })

  return {
    title: title?.param,
    review: review?.param,
    media: media?.param,
    stars: stars.param,
    groupID: groupID.param
  }
}

export const checkRatingUpdate = ({ body }: Request): RatingUpdateInput => {
  const title = body.title && isString(
    { name: 'title', param: body.title }
  )

  const review = body.review && isString(
    { name: 'review', param: body.review }
  )

  const media = body.media && canBeNumber(
    { name: 'media', param: body.media }
  )

  const stars = body.review && canBeNumber(
    { name: 'stars', param: body.stars }
  )

  const isVerified = 'isVerified' in body
    ? isBoolean({ name: 'isVerified', param: body.isVerified })
    : undefined

  const isApproved = 'isApproved' in body
    ? isBoolean({ name: 'isApproved', param: body.isApproved })
    : undefined

  return hasDefinedProps({
    title: title?.param,
    review: review?.param,
    media: media?.param,
    stars: stars?.param,
    isVerified: isVerified?.param,
    isApproved: isApproved?.param
  })
}

export const checkNewRatingComment = ({ body }: Request): RatingCommentCreateInput => {
  const content = R.pipe(
    isProvided,
    isString
  )({ name: 'content', param: body.content })

  const media = body.media && canBeNumber(
    { name: 'media', param: body.media }
  )

  const ratingID = R.pipe(
    isProvided,
    canBeNumber
  )({ name: 'ratingID', param: body.ratingID })

  const parentRatingCommentID = body.parentRatingCommentID && canBeNumber(
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

  const media = body.media && canBeNumber(
    { name: 'media', param: body.media }
  )

  const isApproved = 'isApproved' in body
    ? isBoolean({ name: 'isApproved', param: body.isApproved })
    : undefined

  return hasDefinedProps({
    content: content?.param,
    media: media?.param,
    isApproved: isApproved?.param
  })
}

export const checkNewQuestion = ({ body }: Request): QuestionCreateInput => {
  const content = R.pipe(
    isProvided,
    isString
  )({ name: 'content', param: body.content })

  const media = body.media && canBeNumber(
    { name: 'media', param: body.media }
  )

  const groupID = R.pipe(
    isProvided,
    canBeNumber
  )({ name: 'groupID', param: body.groupID })

  return {
    content: content.param,
    media: media?.param,
    groupID: groupID.param
  }
}

export const checkQuestionUpdate = ({ body }: Request): QuestionUpdateInput => {
  const content = body.content && isString(
    { name: 'content', param: body.content }
  )

  const media = body.media && canBeNumber(
    { name: 'media', param: body.media }
  )

  const isApproved = 'isApproved' in body
    ? isBoolean({ name: 'isApproved', param: body.isApproved })
    : undefined

  return hasDefinedProps({
    content: content?.param,
    media: media?.param,
    isApproved: isApproved?.param
  })
}

export const checkNewAnswer = ({ body }: Request): AnswerCreateInput => {
  const content = R.pipe(
    isProvided,
    isString
  )({ name: 'content', param: body.content })

  const media = body.media && canBeNumber(
    { name: 'media', param: body.media }
  )

  const questionID = R.pipe(
    isProvided,
    canBeNumber
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

  const media = body.media && canBeNumber(
    { name: 'media', param: body.media }
  )

  const isApproved = 'isApproved' in body
    ? isBoolean({ name: 'isApproved', param: body.isApproved })
    : undefined

  return hasDefinedProps({
    content: content?.param,
    media: media?.param,
    isApproved: isApproved?.param
  })
}

export const checkNewAnswerComment = ({ body }: Request): AnswerCommentCreateInput => {
  const content = R.pipe(
    isProvided,
    isString
  )({ name: 'content', param: body.content })

  const media = body.media && canBeNumber(
    { name: 'media', param: body.media }
  )

  const answerID = R.pipe(
    isProvided,
    canBeNumber
  )({ name: 'answerID', param: body.answerID })

  const parentAnswerCommentID = body.parentAnswerCommentID && canBeNumber(
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

  const media = body.media && canBeNumber(
    { name: 'media', param: body.media }
  )

  const isApproved = 'isApproved' in body
    ? isBoolean({ name: 'isApproved', param: body.isApproved })
    : undefined

  return hasDefinedProps({
    content: content?.param,
    media: media?.param,
    isApproved: isApproved?.param
  })
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

export const checkNewGroupVariant = ({ body }: Request): GroupVariantCreateInput => {
  const name = R.pipe(
    isProvided,
    isString
  )({ name: 'name', param: body.name })

  const value = R.pipe(
    isProvided,
    isString
  )({ name: 'value', param: body.value })

  return {
    name: name.param,
    value: value.param
  }
}

export const checkGroupVariantUpdate = ({ body }: Request): GroupVariantUpdateInput => {
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
    canBeNumber
  )({ name: 'shippingMethodID', param: body.shippingMethodID })

  const userID = R.pipe(
    isProvided,
    canBeNumber
  )({ name: 'userID', param: body.userID })

  const details = R.pipe(
    isProvided,
    isString
  )({ name: 'details', param: body.details })

  const paymentMethodID = R.pipe(
    isProvided,
    canBeNumber
  )({ name: 'paymentMethodID', param: body.paymentMethodID })

  const cart = R.pipe(
    isProvided,
    isArray
  )({ name: 'cart', param: body.cart })

  cart.param.map((cp: any) => {
    canBeNumber({ name: 'productID', param: cp.productID })
    canBeNumber({ name: 'userID', param: cp.userID })
    canBeNumber({ name: 'qty', param: cp.qty })
  })

  return {
    address: address.param,
    userID: userID.param,
    shippingMethodID: shippingMethodID.param,
    details: details.param,
    paymentMethodID: paymentMethodID.param,
    cart: cart.param
  }
}

export const checkOrderUpdate = ({ body }: Request): OrderCreateInput => {
  const address = body.address && isString(
    { name: 'address', param: body.address }
  )

  const orderStatusID = body.orderStatusID && canBeNumber(
    { name: 'orderStatusID', param: body.orderStatusID }
  )

  const shippingMethodID = body.shippingMethodID && canBeNumber(
    { name: 'shippingMethodID', param: body.shippingMethodID }
  )

  return hasDefinedProps({
    address: address?.param,
    orderStatusID: orderStatusID?.param,
    shippingMethodID: shippingMethodID?.param
  })
}

export const checkNewOrderProduct = ({ body }: Request): OrderProductCreateInput => {
  const qty = R.pipe(
    isProvided,
    canBeNumber
  )({ name: 'qty', param: body.qty })

  const price = R.pipe(
    isProvided,
    canBeNumber
  )({ name: 'price', param: body.price })

  const productID = R.pipe(
    isProvided,
    canBeNumber
  )({ name: 'productID', param: body.productID })

  return {
    qty: qty.param,
    price: price.param,
    productID: productID.param
  }
}

export const checkOrderProductUpdate = ({ body }: Request): OrderProductUpdateInput => {
  const qty = body.qty && canBeNumber({ name: 'qty', param: body.qty })
  const price = body.price && canBeNumber({ name: 'price', param: body.price })

  return hasDefinedProps({
    qty: qty?.param,
    price: price?.param
  })
}

export const checkNewInvoice = ({ body }: Request): InvoiceCreateInput => {
  const details = R.pipe(
    isProvided,
    isString
  )({ name: 'details', param: body.details })

  const amount = R.pipe(
    isProvided,
    canBeNumber
  )({ name: 'amount', param: body.amount })

  const paymentMethodID = R.pipe(
    isProvided,
    canBeNumber
  )({ name: 'paymentMethodID', param: body.paymentMethodID })

  const userID = R.pipe(
    isProvided,
    canBeNumber
  )({ name: 'userID', param: body.userID })

  const orderID = R.pipe(
    isProvided,
    canBeNumber
  )({ name: 'orderID', param: body.orderID })

  return {
    amount: amount.param,
    details: details.param,
    orderID: orderID.param,
    userID: userID.param,
    paymentMethodID: paymentMethodID.param
  }
}

export const checkInvoiceUpdate = ({ body }: Request): InvoiceUpdateInput => {
  const amount = body.amount && canBeNumber(
    { name: 'amount', param: body.amount }
  )

  const details = body.details && isString(
    { name: 'details', param: body.details }
  )

  const invoiceStatusID = body.invoiceStatusID && canBeNumber(
    { name: 'invoiceStatusID', param: body.invoiceStatusID }
  )

  const paymentMethodID = body.paymentMethodID && canBeNumber(
    { name: 'paymentMethodID', param: body.paymentMethodID }
  )

  return hasDefinedProps({
    amount: amount?.param,
    details: details?.param,
    invoiceStatusID: invoiceStatusID?.param,
    paymentMethodID: paymentMethodID?.param
  })
}
