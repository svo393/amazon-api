import { Request } from 'express'
import { pipe } from 'ramda'
import { AddressCreateInput, AddressTypeInput, AddressUpdateInput, AnswerCreateInput, AnswerUpdateInput, AskFiltersInput, CartProductInput, CategoriesFiltersInput, CategoryCreateInput, CategoryUpdateInput, CursorInput, FeedFiltersInput, GroupVariationCreateInput, GroupVariationDeleteInput, GroupVariationUpdateInput, ImagesDeleteInput, ImagesFiltersInput, ImagesUpdateInput, InvoiceCreateInput, InvoicesFiltersInput, InvoiceStatus, InvoiceUpdateInput, ListCreateInput, LocalCart, ModerationStatus, OrderCreateInput, OrderProductInput, OrdersFiltersInput, OrderStatus, OrderUpdateInput, ParameterInput, PasswordRequestInput, PasswordResetInput, PaymentMethod, ProductCreateInput, ProductsFiltersInput, ProductUpdateInput, QuestionCreateInput, QuestionCursorInput, QuestionUpdateInput, ReviewCommentCreateInput, ReviewCommentUpdateInput, ReviewCreateInput, ReviewsFiltersInput, ReviewUpdateInput, Role, ShippingMethodInput, UserAddressCreateInput, UserAddressUpdateInput, UserLoginInput, UsersFiltersInput, UserSignupInput, UserUpdateInput, VendorInput, VendorsFiltersInput, VotesCreateInput, VotesFiltersInput } from '../types'
import { canBeBoolean, canBeNumber, hasDefinedProps, isArray, isDate, isEmail, isInputProvided, isNonEmptyString, isObject, isPasswordValid, isPositiveNumber, isProvided, isSomeProvided, isString } from './validatorLib'

export const checkNewUser = ({ body }: Request): UserSignupInput => {
  const email = pipe(
    isProvided,
    isNonEmptyString,
    isEmail
  )({ name: 'email', param: body.email })

  const password = pipe(
    isProvided,
    isNonEmptyString,
    isPasswordValid
  )({ name: 'password', param: body.password })

  const name = pipe(
    isProvided,
    isNonEmptyString
  )({ name: 'name', param: body.name })

  return {
    email: email.param.toLowerCase(),
    password: password.param,
    name: name.param
  }
}

export const checkUserLogin = ({ body }: Request): UserLoginInput => {
  const email = pipe(
    isProvided,
    isNonEmptyString,
    isEmail
  )({ name: 'email', param: body.email })

  const password = pipe(
    isProvided,
    isNonEmptyString
  )({ name: 'password', param: body.password })

  const remember = pipe(
    isProvided,
    canBeBoolean
  )({ name: 'remember', param: body.remember })

  return {
    email: email.param.toLowerCase(),
    password: password.param,
    remember: remember.param
  }
}

export const checkUserUpdate = ({ body }: Request): UserUpdateInput => {
  const password = 'password' in body
    ? pipe(
      isNonEmptyString,
      isPasswordValid
    )({ name: 'password', param: body.password })
    : undefined

  const email = 'email' in body
    ? pipe(
      isNonEmptyString,
      isEmail
    )({ name: 'email', param: body.email })
    : undefined

  const name = 'name' in body
    ? isNonEmptyString(
      { name: 'name', param: body.name }
    )
    : undefined

  const info = 'info' in body
    ? isNonEmptyString({ name: 'info', param: body.info })
    : undefined

  const avatar = 'avatar' in body
    ? canBeBoolean({ name: 'avatar', param: body.avatar })
    : undefined

  const role = 'role' in body
    ? isNonEmptyString({ name: 'role', param: body.role })
    : undefined

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
  const email = pipe(
    isProvided,
    isNonEmptyString,
    isEmail
  )({ name: 'email', param: body.email })

  return { email: email.param.toLowerCase() }
}

export const checkUserResetToken = ({ body }: Request): PasswordResetInput => {
  const resetToken = pipe(
    isProvided,
    isNonEmptyString
  )({ name: 'resetToken', param: body.resetToken })

  const password = pipe(
    isProvided,
    isNonEmptyString,
    isPasswordValid
  )({ name: 'password', param: body.password })

  return {
    resetToken: resetToken.param,
    password: password.param
  }
}

export const checkNewProduct = ({ body }: Request): ProductCreateInput => {
  const title = pipe(
    isProvided,
    isNonEmptyString
  )({ name: 'title', param: body.title })

  const listPrice = 'listPrice' in body
    ? canBeNumber({ name: 'listPrice', param: body.listPrice })
    : undefined

  const price = pipe(
    isProvided,
    canBeNumber
  )({ name: 'price', param: body.price })

  const bullets = pipe(
    isProvided,
    isNonEmptyString
  )({ name: 'bullets', param: body.bullets })

  const description = 'description' in body
    ? isNonEmptyString({ name: 'description', param: body.description })
    : undefined

  const stock = 'stock' in body
    ? canBeNumber({ name: 'stock', param: body.stock })
    : undefined

  let productSizes = 'productSizes' in body
    ? isArray({ name: 'productSizes', param: body.productSizes })
    : undefined

  productSizes = {
    ...productSizes,
    param: productSizes?.param.map((pp: any) => ({
      name: pipe(
        isProvided,
        isNonEmptyString
      )({ name: 'name', param: pp.name }).param,
      qty: pipe(
        isProvided,
        canBeNumber
      )({ name: 'qty', param: pp.qty }).param
    }))
  }

  isSomeProvided({
    input: [ stock, productSizes ],
    names: [ 'stock', 'productSizes' ]
  })

  const isAvailable = pipe(
    isProvided,
    canBeBoolean
  )({ name: 'isAvailable', param: body.isAvailable })

  const categoryID = pipe(
    isProvided,
    canBeNumber
  )({ name: 'categoryID', param: body.categoryID })

  const vendorID = pipe(
    isProvided,
    canBeNumber
  )({ name: 'vendorID', param: body.vendorID })

  const groupID = 'groupID' in body
    ? canBeNumber({ name: 'groupID', param: body.groupID })
    : undefined

  let groupVariations = 'groupVariations' in body
    ? isArray({ name: 'groupVariations', param: body.groupVariations })
    : undefined

  groupVariations = {
    ...groupVariations,
    param: groupVariations?.param.map((gv: any) => ({
      name: pipe(
        isProvided,
        isNonEmptyString
      )({ name: 'name', param: gv.name }).param,
      value: pipe(
        isProvided,
        isNonEmptyString
      )({ name: 'value', param: gv.value }).param
    }))
  }

  let productParameters = 'productParameters' in body
    ? isArray({ name: 'productParameters', param: body.productParameters })
    : undefined

  productParameters = {
    ...productParameters,
    param: productParameters?.param.map((pp: any) => ({
      parameterID: pipe(
        isProvided,
        canBeNumber
      )({ name: 'parameterID', param: pp.parameterID }).param,
      value: pipe(
        isProvided,
        isNonEmptyString
      )({ name: 'value', param: pp.value }).param
    }))
  }

  return {
    title: title.param,
    listPrice: listPrice?.param,
    price: price.param,
    bullets: bullets.param,
    description: description?.param,
    stock: stock?.param,
    productSizes: productSizes?.param,
    isAvailable: isAvailable.param,
    categoryID: categoryID.param,
    vendorID: vendorID.param,
    groupID: groupID?.param,
    groupVariations: groupVariations?.param,
    productParameters: productParameters?.param
  }
}

export const checkProductUpdate = ({ body }: Request): ProductUpdateInput => {
  const title = pipe(
    isProvided,
    isNonEmptyString
  )({ name: 'title', param: body.title })

  const listPrice = 'listPrice' in body
    ? canBeNumber({ name: 'listPrice', param: body.listPrice })
    : undefined

  const price = pipe(
    isProvided,
    canBeNumber
  )({ name: 'price', param: body.price })

  const bullets = pipe(
    isProvided,
    isNonEmptyString
  )({ name: 'bullets', param: body.bullets })

  const description = pipe(
    isProvided,
    isNonEmptyString
  )({ name: 'description', param: body.description })

  const stock = 'stock' in body
    ? canBeNumber({ name: 'stock', param: body.stock })
    : undefined

  let productSizes = 'productSizes' in body
    ? isArray({ name: 'productSizes', param: body.productSizes })
    : undefined

  productSizes = {
    ...productSizes,
    param: productSizes?.param.map((pp: any) => ({
      name: pipe(
        isProvided,
        isNonEmptyString
      )({ name: 'name', param: pp.name }).param,
      qty: pipe(
        isProvided,
        canBeNumber
      )({ name: 'qty', param: pp.qty }).param
    }))
  }

  isSomeProvided({
    input: [ stock, productSizes ],
    names: [ 'stock', 'productSizes' ]
  })

  const isAvailable = pipe(
    isProvided,
    canBeBoolean
  )({ name: 'isAvailable', param: body.isAvailable })

  const categoryID = pipe(
    isProvided,
    canBeNumber
  )({ name: 'categoryID', param: body.categoryID })

  const vendorID = pipe(
    isProvided,
    canBeNumber
  )({ name: 'vendorID', param: body.vendorID })

  const groupID = pipe(
    isProvided,
    canBeNumber
  )({ name: 'groupID', param: body.groupID })

  let groupVariations = 'groupVariations' in body
    ? isArray({ name: 'groupVariations', param: body.groupVariations })
    : undefined

  groupVariations = {
    ...groupVariations,
    param: groupVariations?.param.map((gv: any) => ({
      name: pipe(
        isProvided,
        isNonEmptyString
      )({ name: 'name', param: gv.name }).param,
      value: pipe(
        isProvided,
        isNonEmptyString
      )({ name: 'value', param: gv.value }).param
    }))
  }

  let productParameters = 'productParameters' in body
    ? isArray({ name: 'productParameters', param: body.productParameters })
    : undefined

  productParameters = {
    ...productParameters,
    param: productParameters?.param.map((pp: any) => ({
      parameterID: pipe(
        isProvided,
        canBeNumber
      )({ name: 'parameterID', param: pp.parameterID }).param,
      value: pipe(
        isProvided,
        isNonEmptyString
      )({ name: 'value', param: pp.value }).param
    }))
  }

  return {
    title: title.param,
    listPrice: listPrice?.param,
    price: price.param,
    bullets: bullets.param,
    description: description.param,
    stock: stock?.param,
    productSizes: productSizes?.param,
    isAvailable: isAvailable.param,
    categoryID: categoryID.param,
    vendorID: vendorID.param,
    groupID: groupID.param,
    groupVariations: groupVariations?.param,
    productParameters: productParameters?.param
  }
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
  const name = pipe(
    isProvided,
    isNonEmptyString
  )({ name: 'name', param: body.name })

  const parentCategoryID = 'parentCategoryID' in body
    ? canBeNumber({ name: 'parentCategoryID', param: body.parentCategoryID })
    : undefined

  return {
    name: name.param,
    parentCategoryID: parentCategoryID?.param
  }
}

export const checkCategoryUpdate = ({ body }: Request): CategoryUpdateInput => {
  const name = 'name' in body
    ? isNonEmptyString({ name: 'name', param: body.name })
    : undefined

  const parentCategoryID = 'parentCategoryID' in body
    ? canBeNumber({ name: 'parentCategoryID', param: body.parentCategoryID })
    : undefined

  return hasDefinedProps<CategoryUpdateInput>({
    name: name?.param,
    parentCategoryID: parentCategoryID?.param
  })
}

export const checkVendor = ({ body }: Request): VendorInput => {
  const name = pipe(
    isProvided,
    isNonEmptyString
  )({ name: 'name', param: body.name })

  return { name: name.param }
}

export const checkRole = ({ body }: Request): Role => {
  const roleName = pipe(
    isProvided,
    isNonEmptyString
  )({ name: 'roleName', param: body.roleName })

  return { roleName: roleName.param }
}

export const checkNewModerationStatus = ({ body }: Request): ModerationStatus => {
  const moderationStatusName = pipe(
    isProvided,
    isNonEmptyString
  )({ name: 'moderationStatusName', param: body.moderationStatusName })

  return { moderationStatusName: moderationStatusName.param }
}

export const checkModerationStatusUpdate = ({ body }: Request): ModerationStatus => {
  const moderationStatusName = pipe(
    isProvided,
    isNonEmptyString
  )({ name: 'moderationStatusName', param: body.moderationStatusName })

  return { moderationStatusName: moderationStatusName.param }
}

export const checkNewOrderStatus = ({ body }: Request): OrderStatus => {
  const orderStatusName = pipe(
    isProvided,
    isNonEmptyString
  )({ name: 'orderStatusName', param: body.orderStatusName })

  return { orderStatusName: orderStatusName.param }
}

export const checkOrderStatusUpdate = ({ body }: Request): OrderStatus => {
  const orderStatusName = pipe(
    isProvided,
    isNonEmptyString
  )({ name: 'orderStatusName', param: body.orderStatusName })

  return { orderStatusName: orderStatusName.param }
}

export const checkNewInvoiceStatus = ({ body }: Request): InvoiceStatus => {
  const invoiceStatusName = pipe(
    isProvided,
    isNonEmptyString
  )({ name: 'invoiceStatusName', param: body.invoiceStatusName })

  return { invoiceStatusName: invoiceStatusName.param }
}

export const checkInvoiceStatusUpdate = ({ body }: Request): InvoiceStatus => {
  const invoiceStatusName = pipe(
    isProvided,
    isNonEmptyString
  )({ name: 'invoiceStatusName', param: body.invoiceStatusName })

  return { invoiceStatusName: invoiceStatusName.param }
}

export const checkShippingMethod = ({ body }: Request): ShippingMethodInput => {
  const shippingMethodName = pipe(
    isProvided,
    isNonEmptyString
  )({ name: 'shippingMethodName', param: body.shippingMethodName })

  const isPrivate = 'isPrivate' in body
    ? canBeBoolean({ name: 'isPrivate', param: body.isPrivate })
    : undefined

  return {
    shippingMethodName: shippingMethodName.param,
    isPrivate: isPrivate?.param
  }
}

export const checkAddressType = ({ body }: Request): AddressTypeInput => {
  const addressTypeName = pipe(
    isProvided,
    isNonEmptyString
  )({ name: 'addressTypeName', param: body.addressTypeName })

  const isPrivate = 'isPrivate' in body
    ? canBeBoolean({ name: 'isPrivate', param: body.isPrivate })
    : undefined

  return {
    addressTypeName: addressTypeName.param,
    isPrivate: isPrivate?.param
  }
}

export const checkLocalCart = ({ body }: Request): LocalCart => {
  const localCart: any[] = body ?? []
  return localCart.map((cp) => ({
    qty: pipe(
      isProvided,
      canBeNumber
    )({ name: 'qty', param: cp.qty }).param,
    productID: pipe(
      isProvided,
      canBeNumber
    )({ name: 'productID', param: cp.productID }).param
  }))
}

export const checkNewCartProduct = ({ body }: Request): CartProductInput => {
  const qty = pipe(
    isProvided,
    canBeNumber
  )({ name: 'qty', param: body.qty })

  return { qty: qty.param }
}

export const checkCartProductUpdate = ({ body }: Request): CartProductInput => {
  const qty = pipe(
    isProvided,
    canBeNumber
  )({ name: 'qty', param: body.qty })
  return { qty: qty.param }
}

export const checkPaymentMethod = ({ body }: Request): PaymentMethod => {
  const paymentMethodName = pipe(
    isProvided,
    isNonEmptyString
  )({ name: 'paymentMethodName', param: body.paymentMethodName })

  return { paymentMethodName: paymentMethodName.param }
}

export const checkNewAddress = ({ body }: Request): AddressCreateInput => {
  const isDefault = 'isDefault' in body
    ? canBeBoolean({ name: 'isDefault', param: body.isDefault })
    : undefined

  const country = pipe(
    isProvided,
    isNonEmptyString
  )({ name: 'country', param: body.country })

  const addressType = pipe(
    isProvided,
    isNonEmptyString
  )({ name: 'addressType', param: body.addressType })

  const fullName = pipe(
    isProvided,
    isNonEmptyString
  )({ name: 'fullName', param: body.fullName })

  const streetAddressLine1 = pipe(
    isProvided,
    isNonEmptyString
  )({ name: 'streetAddressLine1', param: body.streetAddressLine1 })

  const streetAddressLine2 = 'streetAddressLine2' in body
    ? isString({ name: 'streetAddressLine2', param: body.streetAddressLine2 })
    : undefined

  const city = pipe(
    isProvided,
    isNonEmptyString
  )({ name: 'city', param: body.city })

  const region = pipe(
    isProvided,
    isNonEmptyString
  )({ name: 'region', param: body.region })

  const postalCode = pipe(
    isProvided,
    canBeNumber
  )({ name: 'postalCode', param: body.postalCode })

  const phoneNumber = pipe(
    isProvided,
    isNonEmptyString
  )({ name: 'phoneNumber', param: body.phoneNumber })

  return {
    isDefault: isDefault?.param,
    addressType: addressType.param,
    country: country.param,
    fullName: fullName.param,
    streetAddressLine1: streetAddressLine1.param,
    streetAddressLine2: streetAddressLine2?.param,
    city: city.param,
    region: region.param,
    postalCode: postalCode.param,
    phoneNumber: phoneNumber.param
  }
}

export const checkAddressUpdate = ({ body }: Request): AddressUpdateInput => {
  const isDefault = 'isDefault' in body
    ? canBeBoolean({ name: 'isDefault', param: body.isDefault })
    : undefined

  const addressType = 'addressType' in body
    ? isNonEmptyString({ name: 'addressType', param: body.addressType })
    : undefined

  const country = 'country' in body
    ? isNonEmptyString({ name: 'country', param: body.country })
    : undefined

  const fullName = 'fullName' in body
    ? isNonEmptyString({ name: 'fullName', param: body.fullName })
    : undefined

  const streetAddressLine1 = 'streetAddressLine1' in body
    ? isNonEmptyString({ name: 'streetAddressLine1', param: body.streetAddressLine1 })
    : undefined

  const streetAddressLine2 = 'streetAddressLine2' in body
    ? isNonEmptyString({ name: 'streetAddressLine2', param: body.streetAddressLine2 })
    : undefined

  const city = 'city' in body
    ? isNonEmptyString({ name: 'city', param: body.city })
    : undefined

  const region = 'region' in body
    ? isNonEmptyString({ name: 'region', param: body.region })
    : undefined

  const postalCode = 'postalCode' in body
    ? canBeNumber({ name: 'postalCode', param: body.postalCode })
    : undefined

  const phoneNumber = 'phoneNumber' in body
    ? isNonEmptyString({ name: 'phoneNumber', param: body.phoneNumber })
    : undefined

  return hasDefinedProps<AddressUpdateInput>({
    isDefault: isDefault?.param,
    addressType: addressType?.param,
    country: country?.param,
    fullName: fullName?.param,
    streetAddressLine1: streetAddressLine1?.param,
    streetAddressLine2: streetAddressLine2?.param,
    city: city?.param,
    region: region?.param,
    postalCode: postalCode?.param,
    phoneNumber: phoneNumber?.param
  })
}

export const checkNewUserAddress = ({ body }: Request): UserAddressCreateInput => {
  const isDefault = 'isDefault' in body
    ? canBeBoolean({ name: 'isDefault', param: body.isDefault })
    : undefined

  return { isDefault: isDefault?.param }
}

export const checkUserAddressesUpdate = ({ body }: Request): UserAddressUpdateInput => {
  const isDefault = pipe(
    isProvided,
    canBeBoolean
  )({ name: 'isDefault', param: body.isDefault })

  return { isDefault: isDefault.param }
}

export const checkNewList = ({ body }: Request): ListCreateInput => {
  const name = pipe(
    isProvided,
    isNonEmptyString
  )({ name: 'name', param: body.name })

  return { name: name.param }
}

export const checkListUpdate = ({ body }: Request): ListCreateInput => {
  const name = pipe(
    isProvided,
    isNonEmptyString
  )({ name: 'name', param: body.name })

  return { name: name.param }
}

export const checkNewReview = ({ body }: Request): ReviewCreateInput => {
  const title = 'title' in body
    ? isNonEmptyString({ name: 'title', param: body.title })
    : undefined

  const content = pipe(
    isProvided,
    isNonEmptyString
  )({ name: 'content', param: body.content })

  const variation = pipe(
    isProvided,
    isObject
  )({ name: 'variation', param: body.variation })

  const stars = pipe(
    isProvided,
    canBeNumber
  )({ name: 'stars', param: body.stars })

  return {
    title: title?.param,
    content: content.param,
    variation: variation.param,
    stars: stars.param
  }
}

export const checkReviewUpdate = ({ body }: Request): ReviewUpdateInput => {
  const title = 'title' in body
    ? isNonEmptyString({ name: 'title', param: body.title })
    : undefined

  const content = 'content' in body
    ? isNonEmptyString({ name: 'content', param: body.content })
    : undefined

  const stars = 'content' in body
    ? canBeNumber({ name: 'stars', param: body.stars })
    : undefined

  const isVerified = 'isVerified' in body
    ? canBeBoolean({ name: 'isVerified', param: body.isVerified })
    : undefined

  const moderationStatus = 'moderationStatus' in body
    ? isNonEmptyString({ name: 'moderationStatus', param: body.moderationStatus })
    : undefined

  return hasDefinedProps<ReviewUpdateInput>({
    title: title?.param,
    content: content?.param,
    stars: stars?.param,
    isVerified: isVerified?.param,
    moderationStatus: moderationStatus?.param
  })
}

export const checkNewReviewComment = ({ body }: Request): ReviewCommentCreateInput => {
  const content = pipe(
    isProvided,
    isNonEmptyString
  )({ name: 'content', param: body.content })

  const parentReviewCommentID = 'parentReviewCommentID' in body
    ? canBeNumber(
      { name: 'parentReviewCommentID', param: body.parentReviewCommentID }
    )
    : undefined

  return {
    content: content.param,
    parentReviewCommentID: parentReviewCommentID?.param
  }
}

export const checkReviewComments = ({ query }: Request): CursorInput => {
  const startCursor = 'startCursor' in query
    ? canBeNumber({ name: 'startCursor', param: query.startCursor })
    : undefined

  const limit = 'limit' in query
    ? canBeNumber({ name: 'limit', param: query.limit })
    : undefined

  const sortBy = 'sortBy' in query
    ? isNonEmptyString({ name: 'sortBy', param: query.sortBy })
    : undefined

  return {
    startCursor: startCursor?.param,
    sortBy: sortBy?.param,
    limit: limit?.param
  }
}

export const checkReviewCommentUpdate = ({ body }: Request): ReviewCommentUpdateInput => {
  const content = 'content' in body
    ? isNonEmptyString({ name: 'content', param: body.content })
    : undefined

  const moderationStatus = 'moderationStatus' in body
    ? isNonEmptyString({ name: 'moderationStatus', param: body.moderationStatus }) : undefined

  return hasDefinedProps<ReviewCommentUpdateInput>({
    content: content?.param,
    moderationStatus: moderationStatus?.param
  })
}

export const checkQuestionsCursor = ({ query }: Request): QuestionCursorInput => {
  const startCursor = 'startCursor' in query
    ? canBeNumber({ name: 'startCursor', param: query.startCursor })
    : undefined

  const limit = 'limit' in query
    ? canBeNumber({ name: 'limit', param: query.limit })
    : undefined

  const sortBy = 'sortBy' in query
    ? isNonEmptyString({ name: 'sortBy', param: query.sortBy })
    : undefined

  const page = 'page' in query
    ? canBeNumber({ name: 'page', param: query.page })
    : undefined

  const answerLimit = 'answerLimit' in query
    ? canBeNumber({ name: 'answerLimit', param: query.answerLimit })
    : undefined

  const onlyAnswered = 'onlyAnswered' in query
    ? canBeBoolean({ name: 'onlyAnswered', param: query.onlyAnswered })
    : undefined

  return {
    startCursor: startCursor?.param,
    limit: limit?.param,
    page: page?.param,
    sortBy: sortBy?.param,
    answerLimit: answerLimit?.param,
    onlyAnswered: onlyAnswered?.param
  }
}

export const checkNewQuestion = ({ body }: Request): QuestionCreateInput => {
  const content = pipe(
    isProvided,
    isNonEmptyString
  )({ name: 'content', param: body.content })

  return { content: content.param }
}

export const checkQuestionUpdate = ({ body }: Request): QuestionUpdateInput => {
  const content = 'content' in body
    ? isNonEmptyString({ name: 'content', param: body.content })
    : undefined

  const moderationStatus = 'moderationStatus' in body
    ? isNonEmptyString({ name: 'moderationStatus', param: body.moderationStatus })
    : undefined

  return hasDefinedProps<QuestionUpdateInput>({
    content: content?.param,
    moderationStatus: moderationStatus?.param
  })
}

export const checkAnswers = ({ query }: Request): CursorInput => {
  const startCursor = 'startCursor' in query
    ? canBeNumber({ name: 'startCursor', param: query.startCursor })
    : undefined

  const limit = 'limit' in query
    ? canBeNumber({ name: 'limit', param: query.limit })
    : undefined

  const page = 'page' in query
    ? canBeNumber({ name: 'page', param: query.page })
    : undefined

  return {
    startCursor: startCursor?.param,
    page: page?.param,
    limit: limit?.param
  }
}

export const checkNewAnswer = ({ body }: Request): AnswerCreateInput => {
  const content = pipe(
    isProvided,
    isNonEmptyString
  )({ name: 'content', param: body.content })

  return { content: content.param }
}

export const checkAnswerUpdate = ({ body }: Request): AnswerUpdateInput => {
  const content = 'content' in body
    ? isNonEmptyString({ name: 'content', param: body.content })
    : undefined

  const moderationStatus = 'moderationStatus' in body
    ? isNonEmptyString({ name: 'moderationStatus', param: body.moderationStatus })
    : undefined

  return hasDefinedProps<AnswerUpdateInput>({
    content: content?.param,
    moderationStatus: moderationStatus?.param
  })
}

export const checkParameter = ({ body }: Request): ParameterInput => {
  const name = pipe(
    isProvided,
    isNonEmptyString
  )({ name: 'name', param: body.name })

  return { name: name.param }
}

export const checkNewGroupVariation = ({ body }: Request): GroupVariationCreateInput => {
  const name = pipe(
    isProvided,
    isNonEmptyString
  )({ name: 'name', param: body.name })

  const value = pipe(
    isProvided,
    isNonEmptyString
  )({ name: 'value', param: body.value })

  return {
    name: name.param,
    value: value.param
  }
}

export const checkGroupVariationUpdate = ({ body }: Request): GroupVariationUpdateInput => {
  const value = pipe(
    isProvided,
    isNonEmptyString
  )({ name: 'value', param: body.value })

  return { value: value.param }
}

export const checkGroupVariationDeletion = ({ body }: Request): GroupVariationDeleteInput => {
  const name = pipe(
    isProvided,
    isNonEmptyString
  )({ name: 'name', param: body.name })

  return { name: name.param }
}

export const checkNewOrder = ({ body }: Request): OrderCreateInput => {
  const addressID = pipe(
    isProvided,
    canBeNumber
  )({ name: 'addressID', param: body.addressID })

  const shippingMethod = pipe(
    isProvided,
    isNonEmptyString
  )({ name: 'shippingMethod', param: body.shippingMethod })

  const details = pipe(
    isProvided,
    isNonEmptyString
  )({ name: 'details', param: body.details })

  const paymentMethod = pipe(
    isProvided,
    isNonEmptyString
  )({ name: 'paymentMethod', param: body.paymentMethod })

  const cart = pipe(
    isProvided,
    isArray
  )({ name: 'cart', param: body.cart })

  cart.param.map((cp: any) => {
    canBeNumber({ name: 'productID', param: cp.productID })
    canBeNumber({ name: 'userID', param: cp.userID })
    canBeNumber({ name: 'qty', param: cp.qty })
  })

  return {
    addressID: addressID.param,
    shippingMethod: shippingMethod.param,
    details: details.param,
    paymentMethod: paymentMethod.param,
    cart: cart.param
  }
}

export const checkOrderUpdate = ({ body }: Request): OrderUpdateInput => {
  const addressID = 'addressID' in body
    ? canBeNumber({ name: 'addressID', param: body.addressID })
    : undefined

  const orderStatus = 'orderStatus' in body
    ? isNonEmptyString({ name: 'orderStatus', param: body.orderStatus })
    : undefined

  const shippingMethod = 'shippingMethod' in body
    ? isNonEmptyString({ name: 'shippingMethod', param: body.shippingMethod })
    : undefined

  return hasDefinedProps<OrderUpdateInput>({
    addressID: addressID?.param,
    orderStatus: orderStatus?.param,
    shippingMethod: shippingMethod?.param
  })
}

export const checkNewOrderProduct = ({ body }: Request): OrderProductInput => {
  const qty = pipe(
    isProvided,
    canBeNumber
  )({ name: 'qty', param: body.qty })

  const price = pipe(
    isProvided,
    canBeNumber
  )({ name: 'price', param: body.price })

  return { qty: qty.param, price: price.param }
}

export const checkOrderProductUpdate = ({ body }: Request): OrderProductInput => {
  const qty = 'qty' in body
    ? canBeNumber({ name: 'qty', param: body.qty })
    : undefined

  const price = 'price' in body
    ? canBeNumber({ name: 'price', param: body.price })
    : undefined

  return hasDefinedProps<OrderProductInput>({
    qty: qty?.param,
    price: price?.param
  })
}

export const checkNewInvoice = ({ body }: Request): InvoiceCreateInput => {
  const details = pipe(
    isProvided,
    isNonEmptyString
  )({ name: 'details', param: body.details })

  const amount = pipe(
    isProvided,
    canBeNumber
  )({ name: 'amount', param: body.amount })

  const paymentMethod = pipe(
    isProvided,
    isNonEmptyString
  )({ name: 'paymentMethod', param: body.paymentMethod })

  const userID = pipe(
    isProvided,
    canBeNumber
  )({ name: 'userID', param: body.userID })

  const orderID = pipe(
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
  const amount = 'amount' in body
    ? canBeNumber({ name: 'amount', param: body.amount })
    : undefined

  const details = 'details' in body
    ? isNonEmptyString({ name: 'details', param: body.details })
    : undefined

  const invoiceStatus = 'invoiceStatus' in body
    ? isNonEmptyString({ name: 'invoiceStatus', param: body.invoiceStatus })
    : undefined

  const paymentMethod = 'paymentMethod' in body
    ? isNonEmptyString({ name: 'paymentMethod', param: body.paymentMethod })
    : undefined

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

  const sortBy = 'sortBy' in query
    ? isNonEmptyString({ name: 'sortBy', param: query.sortBy })
    : undefined

  const page = 'page' in query
    ? pipe(
      canBeNumber,
      isPositiveNumber
    )({ name: 'page', param: query.page })
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
    ? isNonEmptyString({ name: 'invoiceStatuses', param: query.invoiceStatuses })
    : undefined

  const paymentMethods = 'paymentMethods' in query
    ? isNonEmptyString({ name: 'paymentMethods', param: query.paymentMethods })
    : undefined

  const userEmail = 'userEmail' in query
    ? isNonEmptyString({ name: 'userEmail', param: query.userEmail })
    : undefined

  return {
    sortBy: sortBy?.param,
    page: page?.param,
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

  const sortBy = 'sortBy' in query
    ? isNonEmptyString({ name: 'sortBy', param: query.sortBy })
    : undefined

  const page = 'page' in query
    ? pipe(
      canBeNumber,
      isPositiveNumber
    )({ name: 'page', param: query.page })
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
    ? isNonEmptyString({ name: 'orderStatuses', param: query.orderStatuses })
    : undefined

  const shippingMethods = 'shippingMethods' in query
    ? isNonEmptyString({ name: 'shippingMethods', param: query.shippingMethods })
    : undefined

  const userEmail = 'userEmail' in query
    ? isNonEmptyString({ name: 'userEmail', param: query.userEmail })
    : undefined

  return {
    sortBy: sortBy?.param,
    page: page?.param,
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
    ? isNonEmptyString({ name: 'q', param: query.q })
    : undefined

  const sortBy = 'sortBy' in query
    ? isNonEmptyString({ name: 'sortBy', param: query.sortBy })
    : undefined

  const page = 'page' in query
    ? pipe(
      canBeNumber,
      isPositiveNumber
    )({ name: 'page', param: query.page })
    : undefined

  return {
    sortBy: sortBy?.param,
    page: page?.param,
    q: q?.param
  }
}

export const checkCategoryFilters = ({ query }: Request): CategoriesFiltersInput => {
  const q = 'q' in query
    ? isNonEmptyString({ name: 'q', param: query.q })
    : undefined

  const sortBy = 'sortBy' in query
    ? isNonEmptyString({ name: 'sortBy', param: query.sortBy })
    : undefined

  const page = 'page' in query
    ? pipe(
      canBeNumber,
      isPositiveNumber
    )({ name: 'page', param: query.page })
    : undefined

  return {
    q: q?.param,
    sortBy: sortBy?.param,
    page: page?.param
  }
}

export const checkUserFilters = ({ query }: Request): UsersFiltersInput => {
  const roles = 'roles' in query
    ? isNonEmptyString({ name: 'roles', param: query.roles })
    : undefined

  const createdFrom = 'createdFrom' in query
    ? isDate({ name: 'createdFrom', param: query.createdFrom })
    : undefined

  const createdTo = 'createdTo' in query
    ? isDate({ name: 'createdTo', param: query.createdTo })
    : undefined

  const sortBy = 'sortBy' in query
    ? isNonEmptyString({ name: 'sortBy', param: query.sortBy })
    : undefined

  const page = 'page' in query
    ? pipe(
      canBeNumber,
      isPositiveNumber
    )({ name: 'page', param: query.page })
    : undefined

  const orderCountMin = 'orderCountMin' in query
    ? canBeNumber({ name: 'orderCountMin', param: query.orderCountMin })
    : undefined

  const orderCountMax = 'orderCountMax' in query
    ? canBeNumber({ name: 'orderCountMax', param: query.orderCountMax })
    : undefined

  const reviewCountMin = 'reviewCountMin' in query
    ? canBeNumber({ name: 'reviewCountMin', param: query.reviewCountMin })
    : undefined

  const reviewCountMax = 'reviewCountMax' in query
    ? canBeNumber({ name: 'reviewCountMax', param: query.reviewCountMax })
    : undefined

  const activityCountMin = 'activityCountMin' in query
    ? canBeNumber({ name: 'activityCountMin', param: query.activityCountMin })
    : undefined

  const activityCountMax = 'activityCountMax' in query
    ? canBeNumber({ name: 'activityCountMax', param: query.activityCountMax })
    : undefined

  const email = 'email' in query
    ? isNonEmptyString({ name: 'email', param: query.email })
    : undefined

  return {
    roles: roles?.param,
    sortBy: sortBy?.param,
    page: page?.param,
    createdFrom: createdFrom?.param,
    createdTo: createdTo?.param,
    orderCountMin: orderCountMin?.param,
    orderCountMax: orderCountMax?.param,
    reviewCountMin: reviewCountMin?.param,
    reviewCountMax: reviewCountMax?.param,
    activityCountMin: activityCountMin?.param,
    activityCountMax: activityCountMax?.param,
    email: email?.param
  }
}

export const checkFeedFilters = ({ query }: Request): FeedFiltersInput => {
  const q = 'q' in query
    ? isNonEmptyString({ name: 'q', param: query.q })
    : undefined

  const sortBy = 'sortBy' in query
    ? isNonEmptyString({ name: 'sortBy', param: query.sortBy })
    : undefined

  const groupID = 'groupID' in query
    ? canBeNumber({ name: 'groupID', param: query.groupID })
    : undefined

  const page = 'page' in query
    ? pipe(
      canBeNumber,
      isPositiveNumber
    )({ name: 'page', param: query.page })
    : undefined

  const types = 'types' in query
    ? isNonEmptyString({ name: 'types', param: query.types })
    : undefined

  const moderationStatuses = 'moderationStatuses' in query
    ? isNonEmptyString({ name: 'moderationStatuses', param: query.moderationStatuses })
    : undefined

  const createdFrom = 'createdFrom' in query
    ? isDate({ name: 'createdFrom', param: query.createdFrom })
    : undefined

  const createdTo = 'createdTo' in query
    ? isDate({ name: 'createdTo', param: query.createdTo })
    : undefined

  const userEmail = 'userEmail' in query
    ? isNonEmptyString({ name: 'userEmail', param: query.userEmail })
    : undefined

  return {
    sortBy: sortBy?.param,
    page: page?.param,
    q: q?.param,
    groupID: groupID?.param,
    types: types?.param,
    moderationStatuses: moderationStatuses?.param,
    createdFrom: createdFrom?.param,
    createdTo: createdTo?.param,
    userEmail: userEmail?.param
  }
}

export const checkProductFilters = ({ query }: Request): ProductsFiltersInput => {
  const groupID = 'groupID' in query
    ? canBeNumber({ name: 'groupID', param: query.groupID })
    : undefined

  const sortBy = 'sortBy' in query
    ? isNonEmptyString({ name: 'sortBy', param: query.sortBy })
    : undefined

  const page = 'page' in query
    ? pipe(
      canBeNumber,
      isPositiveNumber
    )({ name: 'page', param: query.page })
    : undefined

  const title = 'title' in query
    ? isNonEmptyString({ name: 'title', param: query.title })
    : undefined

  const priceMin = 'priceMin' in query
    ? canBeNumber({ name: 'priceMin', param: query.priceMin })
    : undefined

  const priceMax = 'priceMax' in query
    ? canBeNumber({ name: 'priceMax', param: query.priceMax })
    : undefined

  const categoryName = 'categoryName' in query
    ? isNonEmptyString({ name: 'categoryName', param: query.categoryName })
    : undefined

  const vendorName = 'vendorName' in query
    ? isNonEmptyString({ name: 'vendorName', param: query.vendorName })
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

  const reviewMin = 'reviewMin' in query
    ? canBeNumber({ name: 'reviewMin', param: query.reviewMin })
    : undefined

  const reviewMax = 'reviewMax' in query
    ? canBeNumber({ name: 'reviewMax', param: query.reviewMax })
    : undefined

  return {
    groupID: groupID?.param,
    sortBy: sortBy?.param,
    page: page?.param,
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
    reviewMin: reviewMin?.param,
    reviewMax: reviewMax?.param
  }
}

export const checkProductMinFilters = ({ query }: Request): ProductsFiltersInput => {
  const title = 'title' in query
    ? isNonEmptyString({ name: 'title', param: query.title })
    : undefined

  return { title: title?.param }
}

export const checkImagesUpdate = ({ body }: Request): ImagesUpdateInput => {
  const images: any[] = isArray({ name: 'images', param: body }).param

  return images.map((i) => ({
    imageID: pipe(
      isProvided,
      canBeNumber
    )({ name: 'imageID', param: i.imageID }).param,
    index: pipe(
      isProvided,
      canBeNumber
    )({ name: 'index', param: i.index }).param
  }))
}

export const checkImagesDelete = ({ body }: Request): ImagesDeleteInput => {
  const images: any[] = isArray({ name: 'images', param: body }).param

  return images.map((i) => ({
    imageID: pipe(
      isProvided,
      canBeNumber
    )({ name: 'imageID', param: i.imageID }).param
  }))
}

export const checkReviewFilters = ({ query }: Request): ReviewsFiltersInput => {
  const q = 'q' in query
    ? isNonEmptyString({ name: 'q', param: query.q })
    : undefined

  const limit = 'limit' in query
    ? canBeNumber({ name: 'limit', param: query.limit })
    : undefined

  const groupID = 'groupID' in query
    ? canBeNumber({ name: 'groupID', param: query.groupID })
    : undefined

  const sortBy = 'sortBy' in query
    ? isNonEmptyString({ name: 'sortBy', param: query.sortBy })
    : undefined

  const variation = 'variation' in query
    ? isNonEmptyString({ name: 'variation', param: query.variation })
    : undefined

  const page = 'page' in query
    ? pipe(
      canBeNumber,
      isPositiveNumber
    )({ name: 'page', param: query.page })
    : undefined

  const userEmail = 'userEmail' in query
    ? isNonEmptyString({ name: 'userEmail', param: query.userEmail })
    : undefined

  const moderationStatuses = 'moderationStatuses' in query
    ? isNonEmptyString({ name: 'moderationStatuses', param: query.moderationStatuses })
    : undefined

  const isVerified = 'isVerified' in query
    ? canBeBoolean({ name: 'isVerified', param: query.isVerified })
    : undefined

  const createdFrom = 'createdFrom' in query
    ? isDate({ name: 'createdFrom', param: query.createdFrom })
    : undefined

  const createdTo = 'createdTo' in query
    ? isDate({ name: 'createdTo', param: query.createdTo })
    : undefined

  const starsMin = 'starsMin' in query
    ? canBeNumber({ name: 'starsMin', param: query.starsMin })
    : undefined

  const starsMax = 'starsMax' in query
    ? canBeNumber({ name: 'starsMax', param: query.starsMax })
    : undefined

  const votesMin = 'votesMin' in query
    ? canBeNumber({ name: 'votesMin', param: query.votesMin })
    : undefined

  const votesMax = 'votesMax' in query
    ? canBeNumber({ name: 'votesMax', param: query.votesMax })
    : undefined

  return {
    sortBy: sortBy?.param,
    page: page?.param,
    limit: limit?.param,
    q: q?.param,
    groupID: groupID?.param,
    variation: variation?.param,
    userEmail: userEmail?.param,
    moderationStatuses: moderationStatuses?.param,
    isVerified: isVerified?.param,
    createdFrom: createdFrom?.param,
    createdTo: createdTo?.param,
    starsMin: starsMin?.param,
    starsMax: starsMax?.param,
    votesMin: votesMin?.param,
    votesMax: votesMax?.param
  }
}

export const checkImageFilters = ({ query }: Request): ImagesFiltersInput => {
  const productID = 'productID' in query
    ? canBeNumber({ name: 'productID', param: query.productID })
    : undefined

  const reviewID = 'reviewID' in query
    ? canBeNumber({ name: 'reviewID', param: query.reviewID })
    : undefined

  const userID = 'userID' in query
    ? canBeNumber({ name: 'userID', param: query.userID })
    : undefined

  return {
    productID: productID?.param,
    reviewID: reviewID?.param,
    userID: userID?.param
  }
}

export const checkNewVote = ({ body }: Request): VotesCreateInput => {
  const vote = pipe(
    isProvided,
    canBeBoolean
  )({ name: 'vote', param: body.vote })

  return { vote: vote.param }
}

export const checkVoteFilters = ({ query }: Request): VotesFiltersInput => {
  const reviewID = 'reviewID' in query
    ? canBeNumber({ name: 'reviewID', param: query.reviewID })
    : undefined

  const questionID = 'questionID' in query
    ? canBeNumber({ name: 'questionID', param: query.questionID })
    : undefined

  const answerID = 'answerID' in query
    ? canBeNumber({ name: 'answerID', param: query.answerID })
    : undefined

  const userID = 'userID' in query
    ? canBeNumber({ name: 'userID', param: query.userID })
    : undefined

  return {
    reviewID: reviewID?.param,
    questionID: questionID?.param,
    answerID: answerID?.param,
    userID: userID?.param
  }
}

export const checkAskFilters = ({ query }: Request): AskFiltersInput => {
  const q = pipe(
    isProvided,
    isNonEmptyString
  )({ name: 'q', param: query.q })

  return { q: q.param }
}
