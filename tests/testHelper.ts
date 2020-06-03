import supertest from 'supertest'
import app from '../src/app'
import { Address, AddressCreateInput, AddressType, AddressTypeInput, Answer, AnswerComment, AnswerCommentCreateInput, AnswerCreateInput, CartProduct, Category, CategoryCreateInput, Follower, Group, GroupVariant, GroupVariantCreateInput, Invoice, InvoiceCreateInput, InvoiceStatus, InvoiceStatusInput, List, ListCreateInput, ListProduct, Order, OrderCreateInput, OrderProduct, OrderProductCreateInput, OrderStatus, OrderStatusInput, Parameter, ParameterCreateInput, PaymentMethod, PaymentMethodInput, Product, ProductParameter, ProductPublicData, Question, QuestionCreateInput, Rating, RatingComment, RatingCommentCreateInput, RatingCreateInput, Role, RoleInput, ShippingMethod, ShippingMethodInput, User, UserAddress, Vendor, VendorInput } from '../src/types'
import { apiURLs } from '../src/utils/constants'
import { db } from '../src/utils/db'
import StatusError from '../src/utils/StatusError'
import { products } from './testProductData'

const api = supertest(app)

export const customerUser = {
  email: 'customer@example.com',
  password: 'yW%491f8UGYJ'
}

export const adminUser = {
  email: 'admin@example.com',
  password: 'yW%491f8UGYJ'
}

export const rootUser = {
  email: 'root@example.com',
  password: 'yW%491f8UGYJ'
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

export const groupVariantsInDB = async (): Promise<GroupVariant[]> => {
  return await db('groupVariants')
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

export const ratingsInDB = async (): Promise<Rating[]> => {
  return await db('ratings')
}

export const ratingCommentsInDB = async (): Promise<RatingComment[]> => {
  return await db('ratingComments')
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
  await db('groupVariants').del()
  await db('answerComments').del()
  await db('answers').del()
  await db('questions').del()
  await db('ratingComments').del()
  await db('ratings').del()
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
    .post('/api/users')
    .send(customerUser)

  await api
    .post('/api/users')
    .send(adminUser)

  await api
    .post('/api/users')
    .send(rootUser)

  const roles = await db<Role>('roles')
  const adminRole = roles.find((r) => r.name === 'ADMIN')
  const rootRole = roles.find((r) => r.name === 'ROOT')

  if (!adminRole || !rootRole) { throw new StatusError() }

  await db('users')
    .update('roleID', adminRole.roleID)
    .where('email', adminUser.email)

  await db('users')
    .update('roleID', rootRole.roleID)
    .where('email', rootUser.email)
}

export const loginAs = async (role: string): Promise<{token: string; userID: number}> => {
  const user = {
    email: `${role}@example.com`,
    password: 'yW%491f8UGYJ',
    remember: true
  }

  const res = await api
    .post('/api/users/login')
    .send(user)

  const token = res.header['set-cookie'][0].split('; ')[0].slice(6)
  return { token, userID: res.body.userID }
}

export const newRole = (): RoleInput => ({
  name: `New Role ${(new Date().getTime()).toString()}`
})

export const createOneRole = async (role: string): Promise<{ addedRole: Role; token: string}> => {
  const { token } = await loginAs(role)

  const { body } = await api
    .post(apiURLs.roles)
    .set('Cookie', `token=${token}`)
    .send(newRole())

  return { addedRole: body, token }
}

export const newShippingMethod = (): ShippingMethodInput => ({
  name: `New ShippingMethod ${(new Date().getTime()).toString()}`
})

export const createOneShippingMethod = async (role: string): Promise<{ addedShippingMethod: ShippingMethod; token: string}> => {
  const { token } = await loginAs(role)

  const { body } = await api
    .post(apiURLs.shippingMethods)
    .set('Cookie', `token=${token}`)
    .send(newShippingMethod())

  return { addedShippingMethod: body, token }
}

export const newAddressType = (): AddressTypeInput => ({
  name: `New AddressType ${(new Date().getTime()).toString()}`
})

export const createOneAddressType = async (role: string): Promise<{ addedAddressType: AddressType; token: string}> => {
  const { token } = await loginAs(role)

  const { body } = await api
    .post(apiURLs.addressTypes)
    .set('Cookie', `token=${token}`)
    .send(newAddressType())

  return { addedAddressType: body, token }
}

export const newPaymentMethod = (): PaymentMethodInput => ({
  name: `New PaymentMethod ${(new Date().getTime()).toString()}`
})

export const createOnePaymentMethod = async (role: string): Promise<{ addedPaymentMethod: PaymentMethod; token: string}> => {
  const { token } = await loginAs(role)

  const { body } = await api
    .post(apiURLs.paymentMethods)
    .set('Cookie', `token=${token}`)
    .send(newPaymentMethod())

  return { addedPaymentMethod: body, token }
}

export const newAddress = async (): Promise<AddressCreateInput> => {
  const { addedAddressType } = await createOneAddressType('root')
  return {
    addr: `New Address ${(new Date().getTime()).toString()}`,
    addressTypeID: addedAddressType.addressTypeID,
    isDefault: true
  }
}

export const createOneFollower = async (): Promise<Follower & { token: string }> => {
  const { token, userID } = await loginAs('root')
  const { userID: follows } = await loginAs('customer')

  const { body }: { body: Follower } = await api
    .post(`${apiURLs.users}/${userID}/follows/${follows}`)
    .set('Cookie', `token=${token}`)
    .send({ userID, follows })

  return { ...body, token }
}

export const createOneAddress = async (role: string): Promise<{ addedAddress: Address; token: string; userID: number}> => {
  const { token, userID } = await loginAs(role)

  const { body } = await api
    .post(apiURLs.addresses)
    .set('Cookie', `token=${token}`)
    .send(await newAddress())

  return { addedAddress: body, token, userID }
}

export const createOneUserAddress = async (): Promise<UserAddress & { token: string}> => {
  const { addedAddress } = await createOneAddress('admin')
  const { userID, token } = await loginAs('customer')

  const { body }: { body: UserAddress } = await api
    .post(apiURLs.userAddresses)
    .set('Cookie', `token=${token}`)
    .send({ userID, addressID: addedAddress.addressID })

  return { ...body, token }
}

export const newList = (): ListCreateInput => ({
  name: `New List ${(new Date().getTime()).toString()}`
})

export const createOneList = async (): Promise<List & { token: string}> => {
  const { token } = await loginAs('customer')

  const { body }: { body: List } = await api
    .post(apiURLs.lists)
    .set('Cookie', `token=${token}`)
    .send(newList())

  return { ...body, token }
}

export const newCategory = (name?: string, parentCategoryID?: number): CategoryCreateInput => ({
  name: name ?? `New Category ${Date.now().toString()}`,
  parentCategoryID
})

export const createOneCategory = async (role: string, name?: string, parentCategoryID?: number): Promise<{ addedCategory: Category; token: string}> => {
  const { token } = await loginAs(role)

  const { body } = await api
    .post(apiURLs.categories)
    .set('Cookie', `token=${token}`)
    .send(newCategory(name, parentCategoryID))

  return { addedCategory: body, token }
}

export const newVendor = (name?: string): VendorInput => ({
  name: name ?? `New Vendor ${(new Date().getTime()).toString()}`
})

export const createOneVendor = async (role: string, name?: string): Promise<{ addedVendor: Vendor; token: string}> => {
  const { token } = await loginAs(role)

  const { body } = await api
    .post(apiURLs.vendors)
    .set('Cookie', `token=${token}`)
    .send(newVendor(name))

  return { addedVendor: body, token }
}

export const newProduct = products[0]

export const createOneProduct = async (role: string, vendorName?: string, categoryName?: string, parentCategoryID?: number): Promise<{addedProduct: ProductPublicData; token: string}> => {
  const { addedCategory } = await createOneCategory(role, categoryName, parentCategoryID)
  const { addedVendor } = await createOneVendor(role, vendorName)
  const { token, userID } = await loginAs(role)

  const { body } = await api
    .post(apiURLs.products)
    .set('Cookie', `token=${token}`)
    .send({
      ...newProduct,
      userID,
      categoryID: addedCategory.categoryID,
      vendorID: addedVendor.vendorID
    })
  return { addedProduct: body, token }
}

export const createOneListProduct = async (): Promise<ListProduct & { token: string; userID: number}> => {
  const { listID, token, userID } = await createOneList()
  const { addedProduct } = await createOneProduct('admin')

  const { body }: { body: ListProduct } = await api
    .post(`${apiURLs.lists}/${listID}/products/${addedProduct.productID}`)
    .set('Cookie', `token=${token}`)
    .send({ listID, productID: addedProduct.productID })

  return { ...body, token, userID }
}

export const newRating = (groupID: number): RatingCreateInput => ({
  title: `New Rating ${(new Date().getTime()).toString()}`,
  stars: 4,
  groupID
})

export const createOneRating = async (): Promise<Rating & { token: string }> => {
  const { token } = await loginAs('customer')
  const { addedProduct } = await createOneProduct('admin')

  const { body }: { body: Rating } = await api
    .post(apiURLs.ratings)
    .set('Cookie', `token=${token}`)
    .send(newRating(addedProduct.groupID))

  return { ...body, token }
}

export const newRatingComment = (ratingID: number): RatingCommentCreateInput => ({
  content: `New RatingComment ${(new Date().getTime()).toString()}`,
  ratingID
})

export const createOneRatingComment = async (): Promise<RatingComment & { token: string }> => {
  const { token } = await loginAs('customer')
  const { ratingID } = await createOneRating()

  const { body }: { body: RatingComment } = await api
    .post(`${apiURLs.ratings}/comments`)
    .set('Cookie', `token=${token}`)
    .send(newRatingComment(ratingID))

  return { ...body, token }
}

export const newQuestion = (groupID: number): QuestionCreateInput => ({
  content: `New Question ${(new Date().getTime()).toString()}`,
  groupID
})

export const createOneQuestion = async (): Promise<Question & { token: string }> => {
  const { token } = await loginAs('customer')
  const { addedProduct } = await createOneProduct('admin')

  const { body }: { body: Question } = await api
    .post(apiURLs.questions)
    .set('Cookie', `token=${token}`)
    .send(newQuestion(addedProduct.groupID))

  return { ...body, token }
}

export const newAnswer = (questionID: number): AnswerCreateInput => ({
  content: `New Answer ${(new Date().getTime()).toString()}`,
  questionID
})

export const createOneAnswer = async (): Promise<Answer & { token: string }> => {
  const { token } = await loginAs('customer')
  const { questionID } = await createOneQuestion()

  const { body }: { body: Answer } = await api
    .post(`${apiURLs.questions}/answers`)
    .set('Cookie', `token=${token}`)
    .send(newAnswer(questionID))

  return { ...body, token }
}

export const newAnswerComment = (answerID: number): AnswerCommentCreateInput => ({
  content: `New AnswerComment ${(new Date().getTime()).toString()}`,
  answerID
})

export const createOneAnswerComment = async (): Promise<AnswerComment & { token: string }> => {
  const { token } = await loginAs('customer')
  const { answerID } = await createOneAnswer()

  const { body }: { body: AnswerComment } = await api
    .post(`${apiURLs.answers}/comments`)
    .set('Cookie', `token=${token}`)
    .send(newAnswerComment(answerID))

  return { ...body, token }
}

export const newGroupVariant = (name?: string, value?: string): GroupVariantCreateInput => ({
  name: name ?? `New GroupVariant Name ${(new Date().getTime()).toString()}`,
  value: value ?? `New GroupVariant Value ${(new Date().getTime()).toString()}`
})

export const createOneGroupVariant = async (role: string, name?: string): Promise<{ addedGroupVariant: GroupVariant; token: string}> => {
  const { addedProduct, token } = await createOneProduct(role)

  const { body } = await api
    .post(`${apiURLs.groups}/${addedProduct.groupID}/product/${addedProduct.productID}`)
    .set('Cookie', `token=${token}`)
    .send(newGroupVariant(name))

  return { addedGroupVariant: body, token }
}

export const newParameter = (name?: string): ParameterCreateInput => ([ {
  name: name ?? `New Parameter ${(new Date().getTime()).toString()}`
} ])

export const createOneParameter = async (role: string, name?: string): Promise<{ addedParameter: Parameter; token: string}> => {
  const { token } = await loginAs(role)

  const { body } = await api
    .post(apiURLs.parameters)
    .set('Cookie', `token=${token}`)
    .send(newParameter(name))

  return { addedParameter: body[0], token }
}

export const newProductParameter = (parameterID: number, productID: number, value?: string): ProductParameter => ({
  value: value ?? `New ProductParameter ${(new Date().getTime()).toString()}`,
  parameterID,
  productID
})

export const createOneProductParameter = async (role: string, name?: string): Promise<{ addedProductParameter: ProductParameter; token: string}> => {
  const { addedParameter, token } = await createOneParameter(role)
  const { addedProduct } = await createOneProduct(role)

  const { body } = await api
    .post(`${apiURLs.parameters}/${addedParameter.parameterID}/product/${addedProduct.productID}`)
    .set('Cookie', `token=${token}`)
    .send(newProductParameter(addedParameter.parameterID, addedProduct.productID, name))

  return { addedProductParameter: body, token }
}

export const newCartProduct = (userID: number, productID: number): CartProduct => ({
  qty: 2,
  userID,
  productID
})

export const createOneCartProduct = async (role: string): Promise<{ addedCartProduct: CartProduct; token: string}> => {
  const { token, userID } = await loginAs(role)
  const { addedProduct } = await createOneProduct('admin')

  const { body } = await api
    .post(`${apiURLs.users}/${userID}/cartProducts`)
    .set('Cookie', `token=${token}`)
    .send(newCartProduct(userID, addedProduct.productID))

  return { addedCartProduct: body, token }
}

export const newOrderStatus = (): OrderStatusInput => ({
  name: `New OrderStatus ${(new Date().getTime()).toString()}`
})

export const createOneOrderStatus = async (orderStatus: string): Promise<{ addedOrderStatus: OrderStatus; token: string}> => {
  const { token } = await loginAs(orderStatus)

  const { body } = await api
    .post(apiURLs.orderStatuses)
    .set('Cookie', `token=${token}`)
    .send(newOrderStatus())

  return { addedOrderStatus: body, token }
}

export const newInvoiceStatus = (): InvoiceStatusInput => ({
  name: `New InvoiceStatus ${(new Date().getTime()).toString()}`
})

export const createOneInvoiceStatus = async (invoiceStatus: string): Promise<{ addedInvoiceStatus: InvoiceStatus; token: string }> => {
  const { token } = await loginAs(invoiceStatus)

  const { body } = await api
    .post(apiURLs.invoiceStatuses)
    .set('Cookie', `token=${token}`)
    .send(newInvoiceStatus())

  return { addedInvoiceStatus: body, token }
}

export const newOrder = (address: string, shippingMethodID: number, userID: number, cart: CartProduct[], paymentMethodID: number): OrderCreateInput => ({
  address,
  details: 'Card 4242 4242 4242 4242',
  paymentMethodID,
  shippingMethodID,
  userID,
  cart
})

export const createOneOrder = async (role: string): Promise<{ addedOrder: Order; token: string }> => {
  const { addedPaymentMethod } = await createOnePaymentMethod('admin')
  const { addedShippingMethod } = await createOneShippingMethod('admin')
  const { addedAddress, token, userID } = await createOneAddress(role)
  const { addedCartProduct: addedCartProduct1 } = await createOneCartProduct(role)
  const { addedCartProduct: addedCartProduct2 } = await createOneCartProduct(role)

  const { body }: { body: Order } = await api
    .post(apiURLs.orders)
    .set('Cookie', `token=${token}`)
    .send(newOrder(
      addedAddress.addr,
      addedShippingMethod.shippingMethodID,
      userID,
      [ addedCartProduct1, addedCartProduct2 ],
      addedPaymentMethod.paymentMethodID
    ))
  return { addedOrder: body, token }
}

export const newOrderProduct = (product: Product | ProductPublicData): OrderProductCreateInput => ({
  qty: 3,
  price: product.price,
  productID: product.productID
})

export const createOneOrderProduct = async (role: string): Promise<{ addedOrderProduct: OrderProduct; token: string }> => {
  const { addedProduct } = await createOneProduct('admin')
  const { addedOrder, token } = await createOneOrder(role)

  const { body }: { body: OrderProduct } = await api
    .post(`${apiURLs.orders}/${addedOrder.orderID}/products`)
    .set('Cookie', `token=${token}`)
    .send(newOrderProduct(addedProduct))
  return { addedOrderProduct: body, token }
}

export const newInvoice = (orderID: number, paymentMethodID: number, userID: number): InvoiceCreateInput => ({
  amount: 1899,
  details: 'Card 4242 4242 4242 4242',
  orderID,
  paymentMethodID,
  userID
})

export const createOneInvoice = async (role: string): Promise<{ addedInvoice: Invoice; token: string }> => {
  const { addedPaymentMethod } = await createOnePaymentMethod('admin')
  const { addedOrder, token } = await createOneOrder(role)

  const { body }: { body: Invoice } = await api
    .post(apiURLs.invoices)
    .set('Cookie', `token=${token}`)
    .send(newInvoice(addedOrder.orderID, addedPaymentMethod.paymentMethodID, addedOrder.userID as number))
  return { addedInvoice: body, token }
}
