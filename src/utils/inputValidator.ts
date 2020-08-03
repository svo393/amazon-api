import { Request } from 'express'
import R from 'ramda'
import { AddressCreateInput, AddressTypeInput, AnswerCommentCreateInput, AnswerCommentUpdateInput, AnswerCreateInput, AnswerUpdateInput, CartProduct, CartProductInput, CategoriesFiltersInput, CategoryCreateInput, CategoryUpdateInput, FeedFiltersInput, GroupVariationCreateInput, GroupVariationDeleteInput, GroupVariationUpdateInput, ImagesDeleteInput, ImagesFiltersInput, ImagesUpdateInput, InvoiceCreateInput, InvoicesFiltersInput, InvoiceStatus, InvoiceUpdateInput, ListCreateInput, ModerationStatus, OrderCreateInput, OrderProductInput, OrdersFiltersInput, OrderStatus, OrderUpdateInput, ParameterInput, PasswordRequestInput, PasswordResetInput, PaymentMethod, ProductCreateInput, ProductsFiltersInput, ProductUpdateInput, QuestionCreateInput, QuestionUpdateInput, RatingCommentCreateInput, RatingCommentUpdateInput, RatingCreateInput, RatingsFiltersInput, RatingUpdateInput, Role, ShippingMethodInput, UserAddressCreateInput, UserAddressUpdateInput, UserLoginInput, UsersFiltersInput, UserSignupInput, UserUpdateInput, VendorInput, VendorsFiltersInput, VotesCreateInput, VotesFiltersInput } from '../types'
import { canBeBoolean, canBeNumber, hasDefinedProps, isArray, isDate, isEmail, isInputProvided, isPasswordValid, isPositiveNumber, isProvided, isSomeProvided, isString } from './validatorLib'

// TODO implement PARTIAL<t>
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
    ? R.pipe(
      isString,
      isPasswordValid
    )({ name: 'password', param: body.password })
    : undefined

  const email = 'email' in body
    ? R.pipe(
      isString,
      isEmail
    )({ name: 'email', param: body.email })
    : undefined

  const name = 'name' in body
    ? isString(
      { name: 'name', param: body.name }
    )
    : undefined

  const info = 'info' in body
    ? isString({ name: 'info', param: body.info })
    : undefined

  const avatar = 'avatar' in body
    ? canBeBoolean({ name: 'avatar', param: body.avatar })
    : undefined

  const role = 'role' in body
    ? isString({ name: 'role', param: body.role })
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

  const listPrice = 'listPrice' in body
    ? canBeNumber({ name: 'listPrice', param: body.listPrice })
    : undefined

  const price = R.pipe(
    isProvided,
    canBeNumber
  )({ name: 'price', param: body.price })

  const bullets = R.pipe(
    isProvided,
    isString
  )({ name: 'bullets', param: body.bullets })

  const description = 'description' in body
    ? isString({ name: 'description', param: body.description })
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
      name: R.pipe(
        isProvided,
        isString
      )({ name: 'name', param: pp.name }).param,
      qty: R.pipe(
        isProvided,
        canBeNumber
      )({ name: 'qty', param: pp.qty }).param
    }))
  }

  isSomeProvided({
    input: [ stock, productSizes ],
    names: [ 'stock', 'productSizes' ]
  })

  const isAvailable = R.pipe(
    isProvided,
    canBeBoolean
  )({ name: 'isAvailable', param: body.isAvailable })

  const categoryID = R.pipe(
    isProvided,
    canBeNumber
  )({ name: 'categoryID', param: body.categoryID })

  const vendorID = R.pipe(
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
      name: R.pipe(
        isProvided,
        isString
      )({ name: 'name', param: gv.name }).param,
      value: R.pipe(
        isProvided,
        isString
      )({ name: 'value', param: gv.value }).param
    }))
  }

  let productParameters = 'productParameters' in body
    ? isArray({ name: 'productParameters', param: body.productParameters })
    : undefined

  productParameters = {
    ...productParameters,
    param: productParameters?.param.map((pp: any) => ({
      parameterID: R.pipe(
        isProvided,
        canBeNumber
      )({ name: 'parameterID', param: pp.parameterID }).param,
      value: R.pipe(
        isProvided,
        isString
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
  const title = R.pipe(
    isProvided,
    isString
  )({ name: 'title', param: body.title })

  const listPrice = 'listPrice' in body
    ? canBeNumber({ name: 'listPrice', param: body.listPrice })
    : undefined

  const price = R.pipe(
    isProvided,
    canBeNumber
  )({ name: 'price', param: body.price })

  const bullets = R.pipe(
    isProvided,
    isString
  )({ name: 'bullets', param: body.bullets })

  const description = R.pipe(
    isProvided,
    isString
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
      name: R.pipe(
        isProvided,
        isString
      )({ name: 'name', param: pp.name }).param,
      qty: R.pipe(
        isProvided,
        canBeNumber
      )({ name: 'qty', param: pp.qty }).param
    }))
  }

  isSomeProvided({
    input: [ stock, productSizes ],
    names: [ 'stock', 'productSizes' ]
  })

  const isAvailable = R.pipe(
    isProvided,
    canBeBoolean
  )({ name: 'isAvailable', param: body.isAvailable })

  const categoryID = R.pipe(
    isProvided,
    canBeNumber
  )({ name: 'categoryID', param: body.categoryID })

  const vendorID = R.pipe(
    isProvided,
    canBeNumber
  )({ name: 'vendorID', param: body.vendorID })

  const groupID = R.pipe(
    isProvided,
    canBeNumber
  )({ name: 'groupID', param: body.groupID })

  let groupVariations = 'groupVariations' in body
    ? isArray({ name: 'groupVariations', param: body.groupVariations })
    : undefined

  groupVariations = {
    ...groupVariations,
    param: groupVariations?.param.map((gv: any) => ({
      name: R.pipe(
        isProvided,
        isString
      )({ name: 'name', param: gv.name }).param,
      value: R.pipe(
        isProvided,
        isString
      )({ name: 'value', param: gv.value }).param
    }))
  }

  let productParameters = 'productParameters' in body
    ? isArray({ name: 'productParameters', param: body.productParameters })
    : undefined

  productParameters = {
    ...productParameters,
    param: productParameters?.param.map((pp: any) => ({
      parameterID: R.pipe(
        isProvided,
        canBeNumber
      )({ name: 'parameterID', param: pp.parameterID }).param,
      value: R.pipe(
        isProvided,
        isString
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
  const name = R.pipe(
    isProvided,
    isString
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
    ? isString({ name: 'name', param: body.name })
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
    ? canBeBoolean({ name: 'isPrivate', param: body.isPrivate })
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
    ? canBeBoolean({ name: 'isPrivate', param: body.isPrivate })
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
    ? canBeBoolean({ name: 'isDefault', param: body.isDefault })
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
    ? canBeBoolean({ name: 'isDefault', param: body.isDefault })
    : undefined

  return { isDefault: isDefault?.param }
}

export const checkUserAddressesUpdate = ({ body }: Request): UserAddressUpdateInput => {
  const isDefault = R.pipe(
    isProvided,
    canBeBoolean
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
  const title = 'title' in body
    ? isString({ name: 'title', param: body.title })
    : undefined

  const review = R.pipe(
    isProvided,
    isString
  )({ name: 'review', param: body.review })

  const stars = R.pipe(
    isProvided,
    canBeNumber
  )({ name: 'stars', param: body.stars })

  return {
    title: title?.param,
    review: review.param,
    stars: stars.param
  }
}

export const checkRatingUpdate = ({ body }: Request): RatingUpdateInput => {
  const title = 'title' in body
    ? isString({ name: 'title', param: body.title })
    : undefined

  const review = 'review' in body
    ? isString({ name: 'review', param: body.review })
    : undefined

  const stars = 'review' in body
    ? canBeNumber({ name: 'stars', param: body.stars })
    : undefined

  const isVerified = 'isVerified' in body
    ? canBeBoolean({ name: 'isVerified', param: body.isVerified })
    : undefined

  const moderationStatus = 'moderationStatus' in body
    ? isString({ name: 'moderationStatus', param: body.moderationStatus })
    : undefined

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

  const parentRatingCommentID = 'parentRatingCommentID' in body
    ? canBeNumber(
      { name: 'parentRatingCommentID', param: body.parentRatingCommentID }
    )
    : undefined

  return {
    content: content.param,
    parentRatingCommentID: parentRatingCommentID?.param
  }
}

export const checkRatingCommentUpdate = ({ body }: Request): RatingCommentUpdateInput => {
  const content = 'content' in body
    ? isString({ name: 'content', param: body.content })
    : undefined

  const moderationStatus = 'moderationStatus' in body
    ? isString({ name: 'moderationStatus', param: body.moderationStatus }) : undefined

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

  return { content: content.param }
}

export const checkQuestionUpdate = ({ body }: Request): QuestionUpdateInput => {
  const content = 'content' in body
    ? isString({ name: 'content', param: body.content })
    : undefined

  const moderationStatus = 'moderationStatus' in body
    ? isString({ name: 'moderationStatus', param: body.moderationStatus })
    : undefined

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

  return { content: content.param }
}

export const checkAnswerUpdate = ({ body }: Request): AnswerUpdateInput => {
  const content = 'content' in body
    ? isString({ name: 'content', param: body.content })
    : undefined

  const moderationStatus = 'moderationStatus' in body
    ? isString({ name: 'moderationStatus', param: body.moderationStatus })
    : undefined

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

  const parentAnswerCommentID = 'parentAnswerCommentID' in body
    ? canBeNumber(
      { name: 'parentAnswerCommentID', param: body.parentAnswerCommentID }
    )
    : undefined

  return {
    content: content.param,
    parentAnswerCommentID: parentAnswerCommentID?.param
  }
}

export const checkAnswerCommentUpdate = ({ body }: Request): AnswerCommentUpdateInput => {
  const content = 'content' in body
    ? isString({ name: 'content', param: body.content })
    : undefined

  const moderationStatus = 'moderationStatus' in body
    ? isString({ name: 'moderationStatus', param: body.moderationStatus }) : undefined

  return hasDefinedProps<AnswerCommentUpdateInput>({
    content: content?.param,
    moderationStatus: moderationStatus?.param
  })
}

export const checkParameter = ({ body }: Request): ParameterInput => {
  const name = R.pipe(
    isProvided,
    isString
  )({ name: 'name', param: body.name })

  return { name: name.param }
}

export const checkNewGroupVariation = ({ body }: Request): GroupVariationCreateInput => {
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

export const checkGroupVariationUpdate = ({ body }: Request): GroupVariationUpdateInput => {
  const value = R.pipe(
    isProvided,
    isString
  )({ name: 'value', param: body.value })

  return { value: value.param }
}

export const checkGroupVariationDeletion = ({ body }: Request): GroupVariationDeleteInput => {
  const name = R.pipe(
    isProvided,
    isString
  )({ name: 'name', param: body.name })

  return { name: name.param }
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
    shippingMethod: shippingMethod.param,
    details: details.param,
    paymentMethod: paymentMethod.param,
    cart: cart.param
  }
}

export const checkOrderUpdate = ({ body }: Request): OrderUpdateInput => {
  const address = 'address' in body
    ? isString({ name: 'address', param: body.address })
    : undefined

  const orderStatus = 'orderStatus' in body
    ? isString({ name: 'orderStatus', param: body.orderStatus })
    : undefined

  const shippingMethod = 'shippingMethod' in body
    ? isString({ name: 'shippingMethod', param: body.shippingMethod })
    : undefined

  return hasDefinedProps<OrderUpdateInput>({
    address: address?.param,
    orderStatus: orderStatus?.param,
    shippingMethod: shippingMethod?.param
  })
}

export const checkNewOrderProduct = ({ body }: Request): OrderProductInput => {
  const qty = R.pipe(
    isProvided,
    canBeNumber
  )({ name: 'qty', param: body.qty })

  const price = R.pipe(
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
  const amount = 'amount' in body
    ? canBeNumber({ name: 'amount', param: body.amount })
    : undefined

  const details = 'details' in body
    ? isString({ name: 'details', param: body.details })
    : undefined

  const invoiceStatus = 'invoiceStatus' in body
    ? isString({ name: 'invoiceStatus', param: body.invoiceStatus })
    : undefined

  const paymentMethod = 'paymentMethod' in body
    ? isString({ name: 'paymentMethod', param: body.paymentMethod })
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
    ? isString({ name: 'sortBy', param: query.sortBy })
    : undefined

  const page = 'page' in query
    ? R.pipe(
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
    ? isString({ name: 'invoiceStatuses', param: query.invoiceStatuses })
    : undefined

  const paymentMethods = 'paymentMethods' in query
    ? isString({ name: 'paymentMethods', param: query.paymentMethods })
    : undefined

  const userEmail = 'userEmail' in query
    ? isString({ name: 'userEmail', param: query.userEmail })
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
    ? isString({ name: 'sortBy', param: query.sortBy })
    : undefined

  const page = 'page' in query
    ? R.pipe(
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
    ? isString({ name: 'orderStatuses', param: query.orderStatuses })
    : undefined

  const shippingMethods = 'shippingMethods' in query
    ? isString({ name: 'shippingMethods', param: query.shippingMethods })
    : undefined

  const userEmail = 'userEmail' in query
    ? isString({ name: 'userEmail', param: query.userEmail })
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
    ? isString({ name: 'q', param: query.q })
    : undefined

  const sortBy = 'sortBy' in query
    ? isString({ name: 'sortBy', param: query.sortBy })
    : undefined

  const page = 'page' in query
    ? R.pipe(
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
    ? isString({ name: 'q', param: query.q })
    : undefined

  const sortBy = 'sortBy' in query
    ? isString({ name: 'sortBy', param: query.sortBy })
    : undefined

  const page = 'page' in query
    ? R.pipe(
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
    ? isString({ name: 'roles', param: query.roles })
    : undefined

  const createdFrom = 'createdFrom' in query
    ? isDate({ name: 'createdFrom', param: query.createdFrom })
    : undefined

  const createdTo = 'createdTo' in query
    ? isDate({ name: 'createdTo', param: query.createdTo })
    : undefined

  const sortBy = 'sortBy' in query
    ? isString({ name: 'sortBy', param: query.sortBy })
    : undefined

  const page = 'page' in query
    ? R.pipe(
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

  const ratingCountMin = 'ratingCountMin' in query
    ? canBeNumber({ name: 'ratingCountMin', param: query.ratingCountMin })
    : undefined

  const ratingCountMax = 'ratingCountMax' in query
    ? canBeNumber({ name: 'ratingCountMax', param: query.ratingCountMax })
    : undefined

  const activityCountMin = 'activityCountMin' in query
    ? canBeNumber({ name: 'activityCountMin', param: query.activityCountMin })
    : undefined

  const activityCountMax = 'activityCountMax' in query
    ? canBeNumber({ name: 'activityCountMax', param: query.activityCountMax })
    : undefined

  const email = 'email' in query
    ? isString({ name: 'email', param: query.email })
    : undefined

  return {
    roles: roles?.param,
    sortBy: sortBy?.param,
    page: page?.param,
    createdFrom: createdFrom?.param,
    createdTo: createdTo?.param,
    orderCountMin: orderCountMin?.param,
    orderCountMax: orderCountMax?.param,
    ratingCountMin: ratingCountMin?.param,
    ratingCountMax: ratingCountMax?.param,
    activityCountMin: activityCountMin?.param,
    activityCountMax: activityCountMax?.param,
    email: email?.param
  }
}

export const checkFeedFilters = ({ query }: Request): FeedFiltersInput => {
  const q = 'q' in query
    ? isString({ name: 'q', param: query.q })
    : undefined

  const sortBy = 'sortBy' in query
    ? isString({ name: 'sortBy', param: query.sortBy })
    : undefined

  const page = 'page' in query
    ? R.pipe(
      canBeNumber,
      isPositiveNumber
    )({ name: 'page', param: query.page })
    : undefined

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

  const userEmail = 'userEmail' in query
    ? isString({ name: 'userEmail', param: query.userEmail })
    : undefined

  return {
    sortBy: sortBy?.param,
    page: page?.param,
    q: q?.param,
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
    ? isString({ name: 'sortBy', param: query.sortBy })
    : undefined

  const page = 'page' in query
    ? R.pipe(
      canBeNumber,
      isPositiveNumber
    )({ name: 'page', param: query.page })
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
    ratingMin: ratingMin?.param,
    ratingMax: ratingMax?.param
  }
}

export const checkProductMinFilters = ({ query }: Request): ProductsFiltersInput => {
  const title = 'title' in query
    ? isString({ name: 'title', param: query.title })
    : undefined

  return { title: title?.param }
}

export const checkImagesUpdate = ({ body }: Request): ImagesUpdateInput => {
  const images: any[] = isArray({ name: 'images', param: body }).param

  return images.map((i) => ({
    imageID: R.pipe(
      isProvided,
      canBeNumber
    )({ name: 'imageID', param: i.imageID }).param,
    index: R.pipe(
      isProvided,
      canBeNumber
    )({ name: 'index', param: i.index }).param
  }))
}

export const checkImagesDelete = ({ body }: Request): ImagesDeleteInput => {
  const images: any[] = isArray({ name: 'images', param: body }).param

  return images.map((i) => ({
    imageID: R.pipe(
      isProvided,
      canBeNumber
    )({ name: 'imageID', param: i.imageID }).param
  }))
}

export const checkRatingFilters = ({ query }: Request): RatingsFiltersInput => {
  const q = 'q' in query
    ? isString({ name: 'q', param: query.q })
    : undefined

  const groupID = 'groupID' in query
    ? canBeNumber({ name: 'groupID', param: query.groupID })
    : undefined

  const sortBy = 'sortBy' in query
    ? isString({ name: 'sortBy', param: query.sortBy })
    : undefined

  const page = 'page' in query
    ? R.pipe(
      canBeNumber,
      isPositiveNumber
    )({ name: 'page', param: query.page })
    : undefined

  const userEmail = 'userEmail' in query
    ? isString({ name: 'userEmail', param: query.userEmail })
    : undefined

  const moderationStatuses = 'moderationStatuses' in query
    ? isString({ name: 'moderationStatuses', param: query.moderationStatuses })
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

  const likesMin = 'likesMin' in query
    ? canBeNumber({ name: 'likesMin', param: query.likesMin })
    : undefined

  const likesMax = 'likesMax' in query
    ? canBeNumber({ name: 'likesMax', param: query.likesMax })
    : undefined

  const dislikesMin = 'dislikesMin' in query
    ? canBeNumber({ name: 'dislikesMin', param: query.dislikesMin })
    : undefined

  const dislikesMax = 'dislikesMax' in query
    ? canBeNumber({ name: 'dislikesMax', param: query.dislikesMax })
    : undefined

  return {
    sortBy: sortBy?.param,
    page: page?.param,
    q: q?.param,
    groupID: groupID?.param,
    userEmail: userEmail?.param,
    moderationStatuses: moderationStatuses?.param,
    isVerified: isVerified?.param,
    createdFrom: createdFrom?.param,
    createdTo: createdTo?.param,
    starsMin: starsMin?.param,
    starsMax: starsMax?.param,
    likesMin: likesMin?.param,
    likesMax: likesMax?.param,
    dislikesMin: dislikesMin?.param,
    dislikesMax: dislikesMax?.param
  }
}

export const checkImageFilters = ({ query }: Request): ImagesFiltersInput => {
  const productID = 'productID' in query
    ? canBeNumber({ name: 'productID', param: query.productID })
    : undefined

  const ratingID = 'ratingID' in query
    ? canBeNumber({ name: 'ratingID', param: query.ratingID })
    : undefined

  const ratingCommentID = 'ratingCommentID' in query
    ? canBeNumber({ name: 'ratingCommentID', param: query.ratingCommentID })
    : undefined

  const questionID = 'questionID' in query
    ? canBeNumber({ name: 'questionID', param: query.questionID })
    : undefined

  const answerID = 'answerID' in query
    ? canBeNumber({ name: 'answerID', param: query.answerID })
    : undefined

  const answerCommentID = 'answerCommentID' in query
    ? canBeNumber({ name: 'answerCommentID', param: query.answerCommentID })
    : undefined

  const userID = 'userID' in query
    ? canBeNumber({ name: 'userID', param: query.userID })
    : undefined

  return {
    productID: productID?.param,
    ratingID: ratingID?.param,
    ratingCommentID: ratingCommentID?.param,
    questionID: questionID?.param,
    answerID: answerID?.param,
    answerCommentID: answerCommentID?.param,
    userID: userID?.param
  }
}

export const checkNewVote = ({ body }: Request): VotesCreateInput => {
  const vote = R.pipe(
    isProvided,
    canBeBoolean
  )({ name: 'vote', param: body.vote })

  const userID = R.pipe(
    isProvided,
    isString
  )({ name: 'userID', param: body.userID })

  return { vote: vote.param, userID: userID.param }
}

export const checkVoteFilters = ({ query }: Request): VotesFiltersInput => {
  const ratingID = 'ratingID' in query
    ? canBeNumber({ name: 'ratingID', param: query.ratingID })
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
    ratingID: ratingID?.param,
    questionID: questionID?.param,
    answerID: answerID?.param,
    userID: userID?.param
  }
}
