import { Request } from 'express'
import R from 'ramda'
import { AddressCreateInput, AddressTypeInput, AnswerCommentCreateInput, AnswerCommentUpdateInput, AnswerCreateInput, AnswerUpdateInput, CartProduct, CartProductInput, CategoriesFiltersInput, CategoryCreateInput, CategoryUpdateInput, FeedFiltersInput, GroupVariantCreateInput, GroupVariantUpdateInput, ImagesDeleteInput, ImagesUpdateInput, InvoiceCreateInput, InvoicesFiltersInput, InvoiceStatus, InvoiceUpdateInput, ListCreateInput, ModerationStatus, OrderCreateInput, OrderProductCreateInput, OrderProductUpdateInput, OrdersFiltersInput, OrderStatus, OrderUpdateInput, ParameterCreateInput, ParameterUpdateInput, PasswordRequestInput, PasswordResetInput, PaymentMethod, ProductCreateInput, ProductParameterInput, ProductsFiltersInput, ProductUpdateInput, QuestionCreateInput, QuestionUpdateInput, RatingCommentCreateInput, RatingCommentUpdateInput, RatingCreateInput, RatingsFiltersInput, RatingUpdateInput, Role, ShippingMethodInput, UserAddressCreateInput, UserAddressUpdateInput, UserLoginInput, UsersFiltersInput, UserSignupInput, UserUpdateInput, VendorInput, VendorsFiltersInput } from '../types'
import { canBeBoolean, canBeNumber, hasDefinedProps, isArray, isBoolean, isDate, isEmail, isInputProvided, isNumber, isPasswordValid, isProductParameterOrGroupVariant, isProvided, isString, isStringOrNumber } from './validatorLib'

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
    isString
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

  const review = R.pipe(
    isProvided,
    isString
  )({ name: 'review', param: body.review })

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
    review: review.param,
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

  const ratingID = R.pipe(
    isProvided,
    canBeNumber
  )({ name: 'ratingID', param: body.ratingID })

  const parentRatingCommentID = body.parentRatingCommentID && canBeNumber(
    { name: 'parentRatingCommentID', param: body.parentRatingCommentID }
  )

  return {
    content: content.param,
    ratingID: ratingID.param,
    parentRatingCommentID: parentRatingCommentID?.param
  }
}

export const checkRatingCommentUpdate = ({ body }: Request): RatingCommentUpdateInput => {
  const content = body.content && isString(
    { name: 'content', param: body.content }
  )

  const moderationStatus = body.moderationStatus && isString(
    { name: 'moderationStatus', param: body.moderationStatus }
  )

  return hasDefinedProps<RatingCommentUpdateInput>({
    content: content?.param,
    moderationStatus: moderationStatus?.param
  })
}

export const checkNewQuestion = ({ body }: Request): QuestionCreateInput => {
  const content = R.pipe(
    isProvided,
    isString
  )({ name: 'content', param: body.content })

  const groupID = R.pipe(
    isProvided,
    canBeNumber
  )({ name: 'groupID', param: body.groupID })

  return {
    content: content.param,
    groupID: groupID.param
  }
}

export const checkQuestionUpdate = ({ body }: Request): QuestionUpdateInput => {
  const content = body.content && isString(
    { name: 'content', param: body.content }
  )

  const moderationStatus = body.moderationStatus && isString(
    { name: 'moderationStatus', param: body.moderationStatus }
  )

  return hasDefinedProps<QuestionUpdateInput>({
    content: content?.param,
    moderationStatus: moderationStatus?.param
  })
}

export const checkNewAnswer = ({ body }: Request): AnswerCreateInput => {
  const content = R.pipe(
    isProvided,
    isString
  )({ name: 'content', param: body.content })

  const questionID = R.pipe(
    isProvided,
    canBeNumber
  )({ name: 'questionID', param: body.questionID })

  return {
    content: content.param,
    questionID: questionID.param
  }
}

export const checkAnswerUpdate = ({ body }: Request): AnswerUpdateInput => {
  const content = body.content && isString(
    { name: 'content', param: body.content }
  )

  const moderationStatus = body.moderationStatus && isString(
    { name: 'moderationStatus', param: body.moderationStatus }
  )

  return hasDefinedProps<AnswerUpdateInput>({
    content: content?.param,
    moderationStatus: moderationStatus?.param
  })
}

export const checkNewAnswerComment = ({ body }: Request): AnswerCommentCreateInput => {
  const content = R.pipe(
    isProvided,
    isString
  )({ name: 'content', param: body.content })

  const answerID = R.pipe(
    isProvided,
    canBeNumber
  )({ name: 'answerID', param: body.answerID })

  const parentAnswerCommentID = body.parentAnswerCommentID && canBeNumber(
    { name: 'parentAnswerCommentID', param: body.parentAnswerCommentID }
  )

  return {
    content: content.param,
    answerID: answerID.param,
    parentAnswerCommentID: parentAnswerCommentID?.param
  }
}

export const checkAnswerCommentUpdate = ({ body }: Request): AnswerCommentUpdateInput => {
  const content = body.content && isString(
    { name: 'content', param: body.content }
  )

  const moderationStatus = body.moderationStatus && isString(
    { name: 'moderationStatus', param: body.moderationStatus }
  )

  return hasDefinedProps<AnswerCommentUpdateInput>({
    content: content?.param,
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

export const checkInvoiceFilters = ({ query }: Request): InvoicesFiltersInput => {
  const amountMin = 'amountMin' in query
    ? canBeNumber({ name: 'amountMin', param: query.amountMin })
    : undefined

  const amountMax = 'amountMax' in query
    ? canBeNumber({ name: 'amountMax', param: query.amountMax })
    : undefined

  const createdFrom = 'createdFrom' in query
    ? isDate({ name: 'createdFrom', param: query.createdFrom })
    : undefined

  const createdTo = 'createdTo' in query
    ? isDate({ name: 'createdTo', param: query.createdTo })
    : undefined

  const invoiceStatuses = 'invoiceStatuses' in query
    ? isString({ name: 'invoiceStatuses', param: query.invoiceStatuses })
    : undefined

  const paymentMethods = 'paymentMethods' in query
    ? isString({ name: 'paymentMethods', param: query.paymentMethods })
    : undefined

  const userEmail = 'userEmail' in query
    ? isString({ name: 'userEmail', param: query.userEmail })
    : undefined

  return {
    amountMin: amountMin?.param,
    amountMax: amountMax?.param,
    createdFrom: createdFrom?.param,
    createdTo: createdTo?.param,
    invoiceStatuses: invoiceStatuses?.param,
    paymentMethods: paymentMethods?.param,
    userEmail: userEmail?.param
  }
}

export const checkOrderFilters = ({ query }: Request): OrdersFiltersInput => {
  const amountMin = 'amountMin' in query
    ? canBeNumber({ name: 'amountMin', param: query.amountMin })
    : undefined

  const amountMax = 'amountMax' in query
    ? canBeNumber({ name: 'amountMax', param: query.amountMax })
    : undefined

  const createdFrom = 'createdFrom' in query
    ? isDate({ name: 'createdFrom', param: query.createdFrom })
    : undefined

  const createdTo = 'createdTo' in query
    ? isDate({ name: 'createdTo', param: query.createdTo })
    : undefined

  const orderStatuses = 'orderStatuses' in query
    ? isString({ name: 'orderStatuses', param: query.orderStatuses })
    : undefined

  const shippingMethods = 'shippingMethods' in query
    ? isString({ name: 'shippingMethods', param: query.shippingMethods })
    : undefined

  const userEmail = 'userEmail' in query
    ? isString({ name: 'userEmail', param: query.userEmail })
    : undefined

  return {
    amountMin: amountMin?.param,
    amountMax: amountMax?.param,
    createdFrom: createdFrom?.param,
    createdTo: createdTo?.param,
    orderStatuses: orderStatuses?.param,
    shippingMethods: shippingMethods?.param,
    userEmail: userEmail?.param
  }
}

export const checkVendorFilters = ({ query }: Request): VendorsFiltersInput => {
  const q = 'q' in query
    ? isString({ name: 'q', param: query.q })
    : undefined

  return { q: q?.param }
}

export const checkCategoryFilters = ({ query }: Request): CategoriesFiltersInput => {
  const q = 'q' in query
    ? isString({ name: 'q', param: query.q })
    : undefined

  return { q: q?.param }
}

export const checkUserFilters = ({ query }: Request): UsersFiltersInput => {
  const roles = 'roles' in query
    ? isString({ name: 'roles', param: query.roles })
    : undefined

  const createdFrom = 'createdFrom' in query
    ? isDate({ name: 'createdFrom', param: query.createdFrom })
    : undefined

  const createdTo = 'createdTo' in query
    ? isDate({ name: 'createdTo', param: query.createdTo })
    : undefined

  const orderCountMin = 'orderCountMin' in query
    ? canBeNumber({ name: 'orderCountMin', param: query.orderCountMin })
    : undefined

  const orderCountMax = 'orderCountMax' in query
    ? canBeNumber({ name: 'orderCountMax', param: query.orderCountMax })
    : undefined

  const ratingCountMin = 'ratingCountMin' in query
    ? canBeNumber({ name: 'ratingCountMin', param: query.ratingCountMin })
    : undefined

  const ratingCountMax = 'ratingCountMax' in query
    ? canBeNumber({ name: 'ratingCountMax', param: query.ratingCountMax })
    : undefined

  const activitiesCountMin = 'activitiesCountMin' in query
    ? canBeNumber({ name: 'activitiesCountMin', param: query.activitiesCountMin })
    : undefined

  const activitiesCountMax = 'activitiesCountMax' in query
    ? canBeNumber({ name: 'activitiesCountMax', param: query.activitiesCountMax })
    : undefined

  const email = 'email' in query
    ? isString({ name: 'email', param: query.email })
    : undefined

  return {
    roles: roles?.param,
    createdFrom: createdFrom?.param,
    createdTo: createdTo?.param,
    orderCountMin: orderCountMin?.param,
    orderCountMax: orderCountMax?.param,
    ratingCountMin: ratingCountMin?.param,
    ratingCountMax: ratingCountMax?.param,
    activitiesCountMin: activitiesCountMin?.param,
    activitiesCountMax: activitiesCountMax?.param,
    email: email?.param
  }
}

export const checkFeedFilters = ({ query }: Request): FeedFiltersInput => {
  const types = 'types' in query
    ? isString({ name: 'types', param: query.types })
    : undefined

  const moderationStatuses = 'moderationStatuses' in query
    ? isString({ name: 'moderationStatuses', param: query.moderationStatuses })
    : undefined

  const createdFrom = 'createdFrom' in query
    ? isDate({ name: 'createdFrom', param: query.createdFrom })
    : undefined

  const createdTo = 'createdTo' in query
    ? isDate({ name: 'createdTo', param: query.createdTo })
    : undefined

  const content = 'content' in query
    ? isString({ name: 'content', param: query.content })
    : undefined

  const userEmail = 'userEmail' in query
    ? isString({ name: 'userEmail', param: query.userEmail })
    : undefined

  return {
    types: types?.param,
    moderationStatuses: moderationStatuses?.param,
    createdFrom: createdFrom?.param,
    createdTo: createdTo?.param,
    content: content?.param,
    userEmail: userEmail?.param
  }
}

export const checkProductFilters = ({ query }: Request): ProductsFiltersInput => {
  const groupID = 'groupID' in query
    ? canBeNumber({ name: 'groupID', param: query.groupID })
    : undefined

  const title = 'title' in query
    ? isString({ name: 'title', param: query.title })
    : undefined

  const priceMin = 'priceMin' in query
    ? canBeNumber({ name: 'priceMin', param: query.priceMin })
    : undefined

  const priceMax = 'priceMax' in query
    ? canBeNumber({ name: 'priceMax', param: query.priceMax })
    : undefined

  const categoryName = 'categoryName' in query
    ? isString({ name: 'categoryName', param: query.categoryName })
    : undefined

  const vendorName = 'vendorName' in query
    ? isString({ name: 'vendorName', param: query.vendorName })
    : undefined

  const stockMin = 'stockMin' in query
    ? canBeNumber({ name: 'stockMin', param: query.stockMin })
    : undefined

  const stockMax = 'stockMax' in query
    ? canBeNumber({ name: 'stockMax', param: query.stockMax })
    : undefined

  const isAvailable = 'isAvailable' in query
    ? canBeBoolean({ name: 'isAvailable', param: query.isAvailable })
    : undefined

  const starsMin = 'starsMin' in query
    ? canBeNumber({ name: 'starsMin', param: query.starsMin })
    : undefined

  const starsMax = 'starsMax' in query
    ? canBeNumber({ name: 'starsMax', param: query.starsMax })
    : undefined

  const ratingMin = 'ratingMin' in query
    ? canBeNumber({ name: 'ratingMin', param: query.ratingMin })
    : undefined

  const ratingMax = 'ratingMax' in query
    ? canBeNumber({ name: 'ratingMax', param: query.ratingMax })
    : undefined

  return {
    groupID: groupID?.param,
    title: title?.param,
    priceMin: priceMin?.param,
    priceMax: priceMax?.param,
    categoryName: categoryName?.param,
    vendorName: vendorName?.param,
    stockMin: stockMin?.param,
    stockMax: stockMax?.param,
    isAvailable: isAvailable?.param,
    starsMin: starsMin?.param,
    starsMax: starsMax?.param,
    ratingMin: ratingMin?.param,
    ratingMax: ratingMax?.param
  }
}

export const checkImagesUpdate = ({ body }: Request): ImagesUpdateInput => {
  const images: any[] = isArray({ name: 'images', param: body }).param

  return images.map((i) => ({
    imageID: R.pipe(
      isProvided,
      isNumber
    )({ name: 'imageID', param: i.imageID }).param,
    index: R.pipe(
      isProvided,
      isNumber
    )({ name: 'index', param: i.index }).param
  }))
}

export const checkImagesDelete = ({ body }: Request): ImagesDeleteInput => {
  const images: any[] = isArray({ name: 'images', param: body }).param

  return images.map((i) => ({
    imageID: R.pipe(
      isProvided,
      isNumber
    )({ name: 'imageID', param: i.imageID }).param
  }))
}

export const checkRatingFilters = ({ query }: Request): RatingsFiltersInput => {
  const groupID = 'groupID' in query
    ? canBeNumber({ name: 'groupID', param: query.groupID })
    : undefined

  const userEmail = 'userEmail' in query
    ? isString({ name: 'userEmail', param: query.userEmail })
    : undefined

  return {
    groupID: groupID?.param,
    userEmail: userEmail?.param
  }
}
