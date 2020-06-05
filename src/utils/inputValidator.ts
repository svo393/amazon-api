import { Request } from 'express'
import R from 'ramda'
import { AddressCreateInput, AddressTypeInput, AnswerCommentCreateInput, AnswerCommentUpdateInput, AnswerCreateInput, AnswerUpdateInput, CartProduct, CartProductInput, CategoryCreateInput, CategoryUpdateInput, GroupVariantCreateInput, GroupVariantUpdateInput, InvoiceCreateInput, InvoiceStatus, InvoiceUpdateInput, ListCreateInput, OrderCreateInput, OrderProductCreateInput, OrderProductUpdateInput, OrderStatus, OrderUpdateInput, ParameterCreateInput, ParameterUpdateInput, PasswordRequestInput, PasswordResetInput, PaymentMethod, ProductCreateInput, ProductParameterInput, ProductUpdateInput, QuestionCreateInput, QuestionUpdateInput, RatingCommentCreateInput, RatingCommentUpdateInput, RatingCreateInput, RatingUpdateInput, Role, ShippingMethodInput, UserAddressCreateInput, UserAddressUpdateInput, UserLoginInput, UserSignupInput, UserUpdateInput, VendorInput, ModerationStatus } from '../types'
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

  const role = body.role && isString(
    { name: 'role', param: body.role }
  )

  return hasDefinedProps<UserUpdateInput>({
    name: name?.param,
    info: info?.param,
    email: email?.param.toLowerCase(),
    password: password?.param,
    avatar: avatar?.param,
    role: role?.param
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

  return hasDefinedProps<ProductUpdateInput>({
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

  return hasDefinedProps<CategoryUpdateInput>({
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

export const checkRole = ({ body }: Request): Role => {
  const roleName = R.pipe(
    isProvided,
    isString
  )({ name: 'roleName', param: body.roleName })

  return { roleName: roleName.param }
}

export const checkNewModerationStatus = ({ body }: Request): ModerationStatus => {
  const moderationStatusName = R.pipe(
    isProvided,
    isString
  )({ name: 'moderationStatusName', param: body.moderationStatusName })

  return { moderationStatusName: moderationStatusName.param }
}

export const checkModerationStatusUpdate = ({ body }: Request): ModerationStatus => {
  const moderationStatusName = R.pipe(
    isProvided,
    isString
  )({ name: 'moderationStatusName', param: body.moderationStatusName })

  return { moderationStatusName: moderationStatusName.param }
}

export const checkNewOrderStatus = ({ body }: Request): OrderStatus => {
  const orderStatusName = R.pipe(
    isProvided,
    isString
  )({ name: 'orderStatusName', param: body.orderStatusName })

  return { orderStatusName: orderStatusName.param }
}

export const checkOrderStatusUpdate = ({ body }: Request): OrderStatus => {
  const orderStatusName = R.pipe(
    isProvided,
    isString
  )({ name: 'orderStatusName', param: body.orderStatusName })

  return { orderStatusName: orderStatusName.param }
}

export const checkNewInvoiceStatus = ({ body }: Request): InvoiceStatus => {
  const invoiceStatusName = R.pipe(
    isProvided,
    isString
  )({ name: 'invoiceStatusName', param: body.invoiceStatusName })

  return { invoiceStatusName: invoiceStatusName.param }
}

export const checkInvoiceStatusUpdate = ({ body }: Request): InvoiceStatus => {
  const invoiceStatusName = R.pipe(
    isProvided,
    isString
  )({ name: 'invoiceStatusName', param: body.invoiceStatusName })

  return { invoiceStatusName: invoiceStatusName.param }
}

export const checkShippingMethod = ({ body }: Request): ShippingMethodInput => {
  const shippingMethodName = R.pipe(
    isProvided,
    isString
  )({ name: 'shippingMethodName', param: body.shippingMethodName })

  const isPrivate = 'isPrivate' in body
    ? isBoolean({ name: 'isPrivate', param: body.isPrivate })
    : undefined

  return {
    shippingMethodName: shippingMethodName.param,
    isPrivate: isPrivate?.param
  }
}

export const checkAddressType = ({ body }: Request): AddressTypeInput => {
  const addressTypeName = R.pipe(
    isProvided,
    isString
  )({ name: 'addressTypeName', param: body.addressTypeName })

  const isPrivate = 'isPrivate' in body
    ? isBoolean({ name: 'isPrivate', param: body.isPrivate })
    : undefined

  return {
    addressTypeName: addressTypeName.param,
    isPrivate: isPrivate?.param
  }
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

export const checkPaymentMethod = ({ body }: Request): PaymentMethod => {
  const paymentMethodName = R.pipe(
    isProvided,
    isString
  )({ name: 'paymentMethodName', param: body.paymentMethodName })

  return { paymentMethodName: paymentMethodName.param }
}

export const checkNewAddress = ({ body }: Request): AddressCreateInput => {
  const isDefault = 'isDefault' in body
    ? isBoolean({ name: 'isDefault', param: body.isDefault })
    : undefined

  const addr = R.pipe(
    isProvided,
    isString
  )({ name: 'addr', param: body.addr })

  const addressType = R.pipe(
    isProvided,
    canBeNumber
  )({ name: 'addressType', param: body.addressType })

  return {
    isDefault: isDefault?.param,
    addr: addr.param,
    addressType: addressType.param
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

  const moderationStatus = body.moderationStatus && isString(
    { name: 'moderationStatus', param: body.moderationStatus }
  )

  return hasDefinedProps<RatingUpdateInput>({
    title: title?.param,
    review: review?.param,
    media: media?.param,
    stars: stars?.param,
    isVerified: isVerified?.param,
    moderationStatus: moderationStatus?.param
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

  const moderationStatus = body.moderationStatus && isString(
    { name: 'moderationStatus', param: body.moderationStatus }
  )

  return hasDefinedProps<RatingCommentUpdateInput>({
    content: content?.param,
    media: media?.param,
    moderationStatus: moderationStatus?.param
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

  const moderationStatus = body.moderationStatus && isString(
    { name: 'moderationStatus', param: body.moderationStatus }
  )

  return hasDefinedProps<QuestionUpdateInput>({
    content: content?.param,
    media: media?.param,
    moderationStatus: moderationStatus?.param
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

  const moderationStatus = body.moderationStatus && isString(
    { name: 'moderationStatus', param: body.moderationStatus }
  )

  return hasDefinedProps<AnswerUpdateInput>({
    content: content?.param,
    media: media?.param,
    moderationStatus: moderationStatus?.param
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

  const moderationStatus = body.moderationStatus && isString(
    { name: 'moderationStatus', param: body.moderationStatus }
  )

  return hasDefinedProps<AnswerCommentUpdateInput>({
    content: content?.param,
    media: media?.param,
    moderationStatus: moderationStatus?.param
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

  const shippingMethod = R.pipe(
    isProvided,
    isString
  )({ name: 'shippingMethod', param: body.shippingMethod })

  const userID = R.pipe(
    isProvided,
    canBeNumber
  )({ name: 'userID', param: body.userID })

  const details = R.pipe(
    isProvided,
    isString
  )({ name: 'details', param: body.details })

  const paymentMethod = R.pipe(
    isProvided,
    isString
  )({ name: 'paymentMethod', param: body.paymentMethod })

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
    shippingMethod: shippingMethod.param,
    details: details.param,
    paymentMethod: paymentMethod.param,
    cart: cart.param
  }
}

export const checkOrderUpdate = ({ body }: Request): OrderUpdateInput => {
  const address = body.address && isString(
    { name: 'address', param: body.address }
  )

  const orderStatus = body.orderStatus && isString(
    { name: 'orderStatus', param: body.orderStatus }
  )

  const shippingMethod = body.shippingMethod && isString(
    { name: 'shippingMethod', param: body.shippingMethod }
  )

  return hasDefinedProps<OrderUpdateInput>({
    address: address?.param,
    orderStatus: orderStatus?.param,
    shippingMethod: shippingMethod?.param
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

  return hasDefinedProps<OrderProductUpdateInput>({
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

  const paymentMethod = R.pipe(
    isProvided,
    isString
  )({ name: 'paymentMethod', param: body.paymentMethod })

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
    paymentMethod: paymentMethod.param
  }
}

export const checkInvoiceUpdate = ({ body }: Request): InvoiceUpdateInput => {
  const amount = body.amount && canBeNumber(
    { name: 'amount', param: body.amount }
  )

  const details = body.details && isString(
    { name: 'details', param: body.details }
  )

  const invoiceStatus = body.invoiceStatus && isString(
    { name: 'invoiceStatus', param: body.invoiceStatus }
  )

  const paymentMethod = body.paymentMethod && isString(
    { name: 'paymentMethod', param: body.paymentMethod }
  )

  return hasDefinedProps<InvoiceUpdateInput>({
    amount: amount?.param,
    details: details?.param,
    invoiceStatus: invoiceStatus?.param,
    paymentMethod: paymentMethod?.param
  })
}
