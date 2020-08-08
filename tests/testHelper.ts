import supertest from 'supertest'
import app from '../src/app'
import { Address, AddressCreateInput, AddressType, AddressTypeInput, Answer, AnswerComment, AnswerCommentCreateInput, AnswerCreateInput, CartProduct, Category, CategoryCreateInput, Follower, Group, GroupVariation, GroupVariationCreateInput, Invoice, InvoiceCreateInput, InvoiceStatus, List, ListCreateInput, ListProduct, Order, OrderCreateInput, OrderProduct, OrderProductInput, OrderStatus, Parameter, ParameterInput, PaymentMethod, Product, ProductParameter, ProductPublicData, Question, QuestionCreateInput, Review, ReviewComment, ReviewCommentCreateInput, ReviewCreateInput, Role, ShippingMethod, ShippingMethodInput, User, UserAddress, Vendor, VendorInput, ModerationStatus } from '../src/types'
import { apiURLs } from '../src/utils/constants'
import { db } from '../src/utils/db'
import { products } from './testProductData'

const api = supertest(app)

export const customerUser = {
  email: 'customer@example.com',
  password: 'yW%491f8UGYJ',
  name: 'Shopper'
}

export const adminUser = {
  email: 'admin@example.com',
  password: 'yW%491f8UGYJ',
  name: 'Adminus'
}

export const rootUser = {
  email: 'root@example.com',
  password: 'yW%491f8UGYJ',
  name: 'Root-root'
}

export const sleep = (ms: number): Promise<any> =>
  new Promise((resolve) => setTimeout(resolve, ms))

export const usersInDB = async (): Promise<User[]> => {
  return await db('users')
}

export const categoriesInDB = async (): Promise<Category[]> => {
  return await db('categories')
}

export const vendorsInDB = async (): Promise<Vendor[]> => {
  return await db('vendors')
}

export const orderProductsInDB = async (): Promise<OrderProduct[]> => {
  return await db('orderProducts')
}

export const parametersInDB = async (): Promise<Parameter[]> => {
  return await db('parameters')
}

export const groupsInDB = async (): Promise<Group[]> => {
  return await db('groups')
}

export const groupVariationsInDB = async (): Promise<GroupVariation[]> => {
  return await db('groupVariations')
}

export const productParametersInDB = async (): Promise<ProductParameter[]> => {
  return await db('productParameters')
}

export const rolesInDB = async (): Promise<Role[]> => {
  return await db('roles')
}

export const ordersInDB = async (): Promise<Order[]> => {
  return await db('orders')
}

export const invoicesInDB = async (): Promise<Invoice[]> => {
  return await db('invoices')
}

export const addressesInDB = async (): Promise<Address[]> => {
  return await db('addresses')
}

export const orderStatusesInDB = async (): Promise<OrderStatus[]> => {
  return await db('orderStatuses')
}

export const moderationStatusesInDB = async (): Promise<ModerationStatus[]> => {
  return await db('moderationStatuses')
}

export const invoiceStatusesInDB = async (): Promise<InvoiceStatus[]> => {
  return await db('invoiceStatuses')
}

export const shippingMethodsInDB = async (): Promise<ShippingMethod[]> => {
  return await db('shippingMethods')
}

export const addressTypesInDB = async (): Promise<AddressType[]> => {
  return await db('addressTypes')
}

export const paymentMethodsInDB = async (): Promise<PaymentMethod[]> => {
  return await db('paymentMethods')
}

export const followersInDB = async (): Promise<Follower[]> => {
  return await db('followers')
}

export const listsInDB = async (): Promise<List[]> => {
  return await db('lists')
}

export const productsInDB = async (): Promise<Product[]> => {
  return await db('products')
}

export const cartProductsInDB = async (): Promise<CartProduct[]> => {
  return await db('cartProducts')
}

export const reviewsInDB = async (): Promise<Review[]> => {
  return await db('reviews')
}

export const reviewCommentsInDB = async (): Promise<ReviewComment[]> => {
  return await db('reviewComments')
}

export const answerCommentsInDB = async (): Promise<AnswerComment[]> => {
  return await db('answerComments')
}

export const questionsInDB = async (): Promise<Question[]> => {
  return await db('questions')
}

export const answersInDB = async (): Promise<Answer[]> => {
  return await db('answers')
}

export const listProductsInDB = async (): Promise<ListProduct[]> => {
  return await db('listProducts')
}

export const userAddressesInDB = async (): Promise<UserAddress[]> => {
  return await db('userAddresses')
}

export const purge = async (): Promise<void> => {
  await db('invoices').del()
  await db('orderProducts').del()
  await db('orders').del()
  await db('cartProducts').del()
  await db('productParameters').del()
  await db('parameters').del()
  await db('groupVariations').del()
  await db('answerComments').del()
  await db('answers').del()
  await db('questions').del()
  await db('reviewComments').del()
  await db('reviews').del()
  await db('listProducts').del()
  await db('products').del()
  await db('groups').del()
  await db('vendors').del()
  await db('categories').del()
  await db('lists').del()
  await db('userAddresses').del()
  await db('followers').del()
  await db('users').del()
}

export const populateUsers = async (): Promise<void> => {
  await api
    .post('/api/auth')
    .send(customerUser)

  await api
    .post('/api/auth')
    .send(adminUser)

  await api
    .post('/api/auth')
    .send(rootUser)

  await db('users')
    .update('role', 'ADMIN')
    .where('email', adminUser.email)

  await db('users')
    .update('role', 'ROOT')
    .where('email', rootUser.email)
}

export const loginAs = async (role: string): Promise<{sessionID: string; userID: number}> => {
  const user = {
    email: `${role}@example.com`,
    password: 'yW%491f8UGYJ',
    remember: true
  }

  const res = await api
    .post('/api/auth/login')
    .send(user)

  const sessionID = res.header['set-cookie'][0].split('; ')[0].slice(10)
  return { sessionID, userID: res.body.userID }
}

export const newRole = (): Role => ({
  roleName: `New Role ${(new Date().getTime()).toString()}`
})

export const createOneRole = async (role: string): Promise<{ addedRole: Role; sessionID: string}> => {
  const { sessionID } = await loginAs(role)

  const { body } = await api
    .post(apiURLs.roles)
    .set('Cookie', `sessionID=${sessionID}`)
    .send(newRole())

  return { addedRole: body, sessionID }
}

export const newShippingMethod = (): ShippingMethodInput => ({
  shippingMethodName: `New ShippingMethod ${(new Date().getTime()).toString()}`
})

export const createOneShippingMethod = async (role: string): Promise<{ addedShippingMethod: ShippingMethod; sessionID: string}> => {
  const { sessionID } = await loginAs(role)

  const { body } = await api
    .post(apiURLs.shippingMethods)
    .set('Cookie', `sessionID=${sessionID}`)
    .send(newShippingMethod())

  return { addedShippingMethod: body, sessionID }
}

export const newAddressType = (): AddressTypeInput => ({
  addressTypeName: `New AddressType ${(new Date().getTime()).toString()}`
})

export const createOneAddressType = async (role: string): Promise<{ addedAddressType: AddressType; sessionID: string}> => {
  const { sessionID } = await loginAs(role)

  const { body } = await api
    .post(apiURLs.addressTypes)
    .set('Cookie', `sessionID=${sessionID}`)
    .send(newAddressType())

  return { addedAddressType: body, sessionID }
}

export const newPaymentMethod = (): PaymentMethod => ({
  paymentMethodName: `New PaymentMethod ${(new Date().getTime()).toString()}`
})

export const createOnePaymentMethod = async (role: string): Promise<{ addedPaymentMethod: PaymentMethod; sessionID: string}> => {
  const { sessionID } = await loginAs(role)

  const { body } = await api
    .post(apiURLs.paymentMethods)
    .set('Cookie', `sessionID=${sessionID}`)
    .send(newPaymentMethod())

  return { addedPaymentMethod: body, sessionID }
}

export const createOneFollower = async (): Promise<Follower & { sessionID: string }> => {
  const { sessionID, userID } = await loginAs('root')
  const { userID: follows } = await loginAs('customer')

  const { body }: { body: Follower } = await api
    .post(`${apiURLs.users}/${userID}/follows/${follows}`)
    .set('Cookie', `sessionID=${sessionID}`)
    .send({ userID, follows })

  return { ...body, sessionID }
}

export const newAddress = async (): Promise<AddressCreateInput> => {
  const { addedAddressType } = await createOneAddressType('root')
  return {
    addr: `New Address ${(new Date().getTime()).toString()}`,
    addressType: addedAddressType.addressTypeName,
    isDefault: true
  }
}

export const createOneAddress = async (role: string): Promise<{ addedAddress: Address; sessionID: string; userID: number}> => {
  const { sessionID, userID } = await loginAs(role)

  const { body } = await api
    .post(apiURLs.addresses)
    .set('Cookie', `sessionID=${sessionID}`)
    .send(await newAddress())

  return { addedAddress: body, sessionID, userID }
}

export const createOneUserAddress = async (): Promise<UserAddress & { sessionID: string}> => {
  const { addedAddress } = await createOneAddress('admin')
  const { sessionID } = await loginAs('customer')

  const { body }: { body: UserAddress } = await api
    .post(`${apiURLs.addresses}/${addedAddress.addressID}/userAddresses`)
    .set('Cookie', `sessionID=${sessionID}`)

  return { ...body, sessionID }
}

export const newList = (): ListCreateInput => ({
  name: `New List ${(new Date().getTime()).toString()}`
})

export const createOneList = async (): Promise<List & { sessionID: string}> => {
  const { sessionID } = await loginAs('customer')

  const { body }: { body: List } = await api
    .post(apiURLs.lists)
    .set('Cookie', `sessionID=${sessionID}`)
    .send(newList())

  return { ...body, sessionID }
}

export const newCategory = (name?: string, parentCategoryID?: number): CategoryCreateInput => ({
  name: name ?? `New Category ${Date.now().toString()}`,
  parentCategoryID
})

export const createOneCategory = async (role: string, name?: string, parentCategoryID?: number): Promise<{ addedCategory: Category; sessionID: string}> => {
  const { sessionID } = await loginAs(role)

  const { body } = await api
    .post(apiURLs.categories)
    .set('Cookie', `sessionID=${sessionID}`)
    .send(newCategory(name, parentCategoryID))

  return { addedCategory: body, sessionID }
}

export const newVendor = (name?: string): VendorInput => ({
  name: name ?? `New Vendor ${(new Date().getTime()).toString()}`
})

export const createOneVendor = async (role: string, name?: string): Promise<{ addedVendor: Vendor; sessionID: string}> => {
  const { sessionID } = await loginAs(role)

  const { body } = await api
    .post(apiURLs.vendors)
    .set('Cookie', `sessionID=${sessionID}`)
    .send(newVendor(name))

  return { addedVendor: body, sessionID }
}

export const newProduct = products[0]

export const createOneProduct = async (role: string, vendorName?: string, categoryName?: string, parentCategoryID?: number): Promise<{addedProduct: ProductPublicData; sessionID: string}> => {
  const { addedCategory } = await createOneCategory(role, categoryName, parentCategoryID)
  const { addedVendor } = await createOneVendor(role, vendorName)
  const { sessionID, userID } = await loginAs(role)

  const { body } = await api
    .post(apiURLs.products)
    .set('Cookie', `sessionID=${sessionID}`)
    .send({
      ...newProduct,
      userID,
      categoryID: addedCategory.categoryID,
      vendorID: addedVendor.vendorID
    })
  return { addedProduct: body, sessionID }
}

export const createOneListProduct = async (): Promise<ListProduct & { sessionID: string; userID: number}> => {
  const { listID, sessionID, userID } = await createOneList()
  const { addedProduct } = await createOneProduct('admin')

  const { body }: { body: ListProduct } = await api
    .post(`${apiURLs.lists}/${listID}/products/${addedProduct.productID}`)
    .set('Cookie', `sessionID=${sessionID}`)
    .send({ listID, productID: addedProduct.productID })

  return { ...body, sessionID, userID }
}

export const newReview = (): ReviewCreateInput => ({
  title: `New Review ${(new Date().getTime()).toString()}`,
  content: `Long Review ${(new Date().getTime()).toString()}`,
  stars: 4,
  variation: { Style: 'Cool' }
})

export const createOneReview = async (): Promise<Review & { sessionID: string }> => {
  const { sessionID } = await loginAs('customer')
  const { addedProduct } = await createOneProduct('admin')

  const { body }: { body: Review } = await api
    .post(`${apiURLs.groups}/${addedProduct.groupID}/reviews`)
    .set('Cookie', `sessionID=${sessionID}`)
    .send(newReview())

  return { ...body, sessionID }
}

export const newReviewComment = (): ReviewCommentCreateInput => ({
  content: `New ReviewComment ${(new Date().getTime()).toString()}`
})

export const createOneReviewComment = async (): Promise<ReviewComment & { sessionID: string }> => {
  const { sessionID } = await loginAs('customer')
  const { reviewID } = await createOneReview()

  const { body }: { body: ReviewComment } = await api
    .post(`${apiURLs.reviews}/${reviewID}/comments`)
    .set('Cookie', `sessionID=${sessionID}`)
    .send(newReviewComment())

  return { ...body, sessionID }
}

export const newQuestion = (): QuestionCreateInput => ({
  content: `New Question ${(new Date().getTime()).toString()}`
})

export const createOneQuestion = async (): Promise<Question & { sessionID: string }> => {
  const { sessionID } = await loginAs('customer')
  const { addedProduct } = await createOneProduct('admin')

  const { body }: { body: Question } = await api
    .post(`${apiURLs.groups}/${addedProduct.groupID}/questions`)
    .set('Cookie', `sessionID=${sessionID}`)
    .send(newQuestion())

  return { ...body, sessionID }
}

export const newAnswer = (): AnswerCreateInput => ({
  content: `New Answer ${(new Date().getTime()).toString()}`
})

export const createOneAnswer = async (): Promise<Answer & { sessionID: string }> => {
  const { sessionID } = await loginAs('customer')
  const { questionID } = await createOneQuestion()

  const { body }: { body: Answer } = await api
    .post(`${apiURLs.questions}/${questionID}/answers`)
    .set('Cookie', `sessionID=${sessionID}`)
    .send(newAnswer())

  return { ...body, sessionID }
}

export const newAnswerComment = (): AnswerCommentCreateInput => ({
  content: `New AnswerComment ${(new Date().getTime()).toString()}`
})

export const createOneAnswerComment = async (): Promise<AnswerComment & { sessionID: string }> => {
  const { sessionID } = await loginAs('customer')
  const { answerID } = await createOneAnswer()

  const { body }: { body: AnswerComment } = await api
    .post(`${apiURLs.answers}/${answerID}/comments`)
    .set('Cookie', `sessionID=${sessionID}`)
    .send(newAnswerComment())

  return { ...body, sessionID }
}

export const newGroupVariation = (name?: string, value?: string): GroupVariationCreateInput => ({
  name: name ?? `New GroupVariation Name ${(new Date().getTime()).toString()}`,
  value: value ?? `New GroupVariation Value ${(new Date().getTime()).toString()}`
})

export const createOneGroupVariation = async (role: string, name?: string): Promise<{ addedGroupVariation: GroupVariation; sessionID: string}> => {
  const { addedProduct, sessionID } = await createOneProduct(role)

  const { body } = await api
    .post(`${apiURLs.groups}/${addedProduct.groupID}/product/${addedProduct.productID}`)
    .set('Cookie', `sessionID=${sessionID}`)
    .send(newGroupVariation(name))

  return { addedGroupVariation: body, sessionID }
}

export const newParameter = (name?: string): ParameterInput => ({
  name: name ?? `New Parameter ${(new Date().getTime()).toString()}`
})

export const createOneParameter = async (role: string, name?: string, sessionID?: string): Promise<{ addedParameter: Parameter; sessionID: string}> => {
  if (sessionID === undefined) sessionID = (await loginAs(role)).sessionID

  const { body } = await api
    .post(apiURLs.parameters)
    .set('Cookie', `sessionID=${sessionID}`)
    .send(newParameter(name))

  return { addedParameter: body, sessionID }
}

export const newProductParameter = (parameterID: number, productID: number, value?: string): ProductParameter => ({
  value: value ?? `New ProductParameter ${(new Date().getTime()).toString()}`,
  parameterID,
  productID
})

export const createOneProductParameter = async (role: string, name?: string): Promise<{ addedProductParameter: ProductParameter; sessionID: string}> => {
  const { addedParameter, sessionID } = await createOneParameter(role)
  const { addedProduct } = await createOneProduct(role)

  const { body } = await api
    .post(`${apiURLs.parameters}/${addedParameter.parameterID}/product/${addedProduct.productID}`)
    .set('Cookie', `sessionID=${sessionID}`)
    .send(newProductParameter(addedParameter.parameterID, addedProduct.productID, name))

  return { addedProductParameter: body, sessionID }
}

export const newCartProduct = (userID: number, productID: number): CartProduct => ({
  qty: 2,
  userID,
  productID
})

export const createOneCartProduct = async (role: string): Promise<{ addedCartProduct: CartProduct; sessionID: string}> => {
  const { sessionID, userID } = await loginAs(role)
  const { addedProduct } = await createOneProduct('admin')

  const { body } = await api
    .post(`${apiURLs.users}/${userID}/cartProducts`)
    .set('Cookie', `sessionID=${sessionID}`)
    .send(newCartProduct(userID, addedProduct.productID))

  return { addedCartProduct: body, sessionID }
}

export const newOrderStatus = (): OrderStatus => ({
  orderStatusName: `New OrderStatus ${(new Date().getTime()).toString()}`
})

export const createOneOrderStatus = async (orderStatus: string): Promise<{ addedOrderStatus: OrderStatus; sessionID: string}> => {
  const { sessionID } = await loginAs(orderStatus)

  const { body } = await api
    .post(apiURLs.orderStatuses)
    .set('Cookie', `sessionID=${sessionID}`)
    .send(newOrderStatus())

  return { addedOrderStatus: body, sessionID }
}

export const newModerationStatus = (): ModerationStatus => ({
  moderationStatusName: `New ModerationStatus ${(new Date().getTime()).toString()}`
})

export const createOneModerationStatus = async (moderationStatus: string): Promise<{ addedModerationStatus: ModerationStatus; sessionID: string}> => {
  const { sessionID } = await loginAs(moderationStatus)

  const { body } = await api
    .post(apiURLs.moderationStatuses)
    .set('Cookie', `sessionID=${sessionID}`)
    .send(newModerationStatus())

  return { addedModerationStatus: body, sessionID }
}

export const newInvoiceStatus = (): InvoiceStatus => ({
  invoiceStatusName: `New InvoiceStatus ${(new Date().getTime()).toString()}`
})

export const createOneInvoiceStatus = async (invoiceStatus: string): Promise<{ addedInvoiceStatus: InvoiceStatus; sessionID: string }> => {
  const { sessionID } = await loginAs(invoiceStatus)

  const { body } = await api
    .post(apiURLs.invoiceStatuses)
    .set('Cookie', `sessionID=${sessionID}`)
    .send(newInvoiceStatus())

  return { addedInvoiceStatus: body, sessionID }
}

export const newOrder = (address: string, shippingMethod: string, cart: CartProduct[], paymentMethod: string): OrderCreateInput => ({
  address,
  details: 'Card 4242 4242 4242 4242',
  paymentMethod,
  shippingMethod,
  cart
})

export const createOneOrder = async (role: string): Promise<{ addedOrder: Order; sessionID: string }> => {
  const { addedPaymentMethod } = await createOnePaymentMethod('admin')
  const { addedShippingMethod } = await createOneShippingMethod('admin')
  const { addedAddress, sessionID, userID } = await createOneAddress(role)
  const { addedCartProduct: addedCartProduct1 } = await createOneCartProduct(role)
  const { addedCartProduct: addedCartProduct2 } = await createOneCartProduct(role)

  const { body }: { body: Order } = await api
    .post(`${apiURLs.users}/${userID}/orders`)
    .set('Cookie', `sessionID=${sessionID}`)
    .send(newOrder(
      addedAddress.addr,
      addedShippingMethod.shippingMethodName,
      [ addedCartProduct1, addedCartProduct2 ],
      addedPaymentMethod.paymentMethodName
    ))
  return { addedOrder: body, sessionID }
}

export const newOrderProduct = (product: Product | ProductPublicData): OrderProductInput => ({ qty: 3, price: product.price })

export const createOneOrderProduct = async (role: string): Promise<{ addedOrderProduct: OrderProduct; sessionID: string }> => {
  const { addedProduct } = await createOneProduct('admin')
  const { addedOrder, sessionID } = await createOneOrder(role)

  const { body }: { body: OrderProduct } = await api
    .post(`${apiURLs.orders}/${addedOrder.orderID}/products/${addedProduct.productID}`)
    .set('Cookie', `sessionID=${sessionID}`)
    .send(newOrderProduct(addedProduct))
  return { addedOrderProduct: body, sessionID }
}

export const newInvoice = (orderID: number, paymentMethod: string, userID: number): InvoiceCreateInput => ({
  amount: 1899,
  details: 'Card 4242 4242 4242 4242',
  orderID,
  paymentMethod,
  userID
})

export const createOneInvoice = async (role: string): Promise<{ addedInvoice: Invoice; sessionID: string }> => {
  const { addedPaymentMethod } = await createOnePaymentMethod('admin')
  const { addedOrder, sessionID } = await createOneOrder(role)

  const { body }: { body: Invoice } = await api
    .post(apiURLs.invoices)
    .set('Cookie', `sessionID=${sessionID}`)
    .send(newInvoice(addedOrder.orderID, addedPaymentMethod.paymentMethodName, addedOrder.userID as number))
  return { addedInvoice: body, sessionID }
}
