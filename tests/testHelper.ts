import supertest from 'supertest'
import app from '../src/app'
import { Address, AddressCreateInput, AddressType, AddressTypeInput, Answer, AnswerComment, AnswerCommentCreateInput, AnswerCreateInput, Category, CategoryCreateInput, Follower, List, ListCreateInput, ListProduct, Product, ProductPublicData, Question, QuestionCreateInput, Rating, RatingComment, RatingCommentCreateInput, RatingCreateInput, Role, RoleInput, ShippingMethod, ShippingMethodInput, User, UserAddress, Vendor, VendorInput, Parameter, Group, GroupInput, ParameterInput, GroupProduct } from '../src/types'
import { apiURLs } from '../src/utils/constants'
import { db } from '../src/utils/db'
import StatusError from '../src/utils/StatusError'
import { products } from './seedData'

const api = supertest(app)

export const customer = {
  email: 'customer@example.com',
  password: '12345678'
}

export const admin = {
  email: 'admin@example.com',
  password: '12345678'
}

export const root = {
  email: 'root@example.com',
  password: '12345678'
}

export const sleep = (ms: number): Promise<any> => new Promise((resolve) => setTimeout(resolve, ms))

export const loginAs: (role: string, api: supertest.SuperTest<supertest.Test>) => Promise<{token: string; userID: number}> =
async (role, api) => {
  const user = {
    email: `${role}@example.com`,
    password: '12345678',
    remember: true
  }

  const res = await api
    .post('/api/users/login')
    .send(user)

  const token = res.header['set-cookie'][0].split('; ')[0].slice(6)
  return { token, userID: res.body.userID }
}

export const purge = async (): Promise<void> => {
  try {
    await db('orderProducts').del()
    await db('invoices').del()
    await db('orders').del()
    await db('cartProducts').del()
    await db('productParameters').del()
    await db('parameters').del()
    await db('groupProducts').del()
    await db('groups').del()
    await db('listProducts').del()
    await db('answerComments').del()
    await db('answers').del()
    await db('questions').del()
    await db('ratingComments').del()
    await db('ratings').del()
    await db('products').del()
    await db('vendors').del()
    await db('categories').del()
    await db('lists').del()
    await db('userAddresses').del()
    await db('followers').del()
    await db('users').del()
  } catch (err) {
    console.error(err)
  }
}

export const populateUsers = async (): Promise<void> => {
  try {
    await api
      .post('/api/users')
      .send(customer)

    await api
      .post('/api/users')
      .send(admin)

    await api
      .post('/api/users')
      .send(root)

    const roles = await db<Role>('roles')
    const adminRole = roles.find((r) => r.name === 'ADMIN')
    const rootRole = roles.find((r) => r.name === 'ROOT')

    if (!adminRole || !rootRole) { throw new StatusError() }

    await db('users')
      .update('roleID', adminRole.roleID)
      .where('email', admin.email)

    await db('users')
      .update('roleID', rootRole.roleID)
      .where('email', root.email)
  } catch (err) {
    console.error(err)
  }
}

export const getUserByEmail = async (email: string): Promise<User> => {
  const user = await db<User>('users')
    .first()
    .where('email', email)

  if (!user) throw new StatusError(404, 'Not Found')
  return user
}

export const usersInDB = async (): Promise<User[]> => {
  return await db<User>('users')
}

export const categoriesInDB = async (): Promise<Category[]> => {
  return await db<Category>('categories')
}

export const vendorsInDB = async (): Promise<Vendor[]> => {
  return await db<Vendor>('vendors')
}

export const parametersInDB = async (): Promise<Parameter[]> => {
  return await db<Parameter>('parameters')
}

export const groupsInDB = async (): Promise<Group[]> => {
  return await db<Group>('groups')
}

export const groupProductsInDB = async (): Promise<GroupProduct[]> => {
  return await db<GroupProduct>('groupProducts')
}

export const rolesInDB = async (): Promise<Role[]> => {
  return await db<Role>('roles')
}

export const addressesInDB = async (): Promise<Address[]> => {
  return await db<Address>('addresses')
}

export const shippingMethodsInDB = async (): Promise<ShippingMethod[]> => {
  return await db<ShippingMethod>('shippingMethods')
}

export const addressTypesInDB = async (): Promise<AddressType[]> => {
  return await db<AddressType>('addressTypes')
}

export const followersInDB = async (): Promise<Follower[]> => {
  return await db<Follower>('followers')
}

export const listsInDB = async (): Promise<List[]> => {
  return await db<List>('lists')
}

export const productsInDB = async (): Promise<Product[]> => {
  return await db<Product>('products')
}

export const ratingsInDB = async (): Promise<Rating[]> => {
  return await db<Rating>('ratings')
}

export const ratingCommentsInDB = async (): Promise<RatingComment[]> => {
  return await db<RatingComment>('ratingComments')
}

export const answerCommentsInDB = async (): Promise<AnswerComment[]> => {
  return await db<AnswerComment>('answerComments')
}

export const questionsInDB = async (): Promise<Question[]> => {
  return await db<Question>('questions')
}

export const answersInDB = async (): Promise<Answer[]> => {
  return await db<Answer>('answers')
}

export const listProductsInDB = async (): Promise<ListProduct[]> => {
  return await db<ListProduct>('listProducts')
}

export const userAddressesInDB = async (): Promise<UserAddress[]> => {
  return await db<UserAddress>('userAddresses')
}

export const newAddressType = (): AddressTypeInput => ({
  name: `New AddressType ${(new Date().getTime()).toString()}`
})

export const newRole = (): RoleInput => ({
  name: `New Role ${(new Date().getTime()).toString()}`
})

export const createOneRole = async (role: string): Promise<{ addedRole: Role; token: string}> => {
  const { token } = await loginAs(role, api)

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
  const { token } = await loginAs(role, api)

  const { body } = await api
    .post(apiURLs.shippingMethods)
    .set('Cookie', `token=${token}`)
    .send(newShippingMethod())

  return { addedShippingMethod: body, token }
}

export const createOneAddressType = async (addressType: string): Promise<{ addedAddressType: AddressType; token: string}> => {
  const { token } = await loginAs(addressType, api)

  const { body } = await api
    .post(apiURLs.addressTypes)
    .set('Cookie', `token=${token}`)
    .send(newAddressType())

  return { addedAddressType: body, token }
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
  const { token, userID } = await loginAs('root', api)
  const { userID: follows } = await loginAs('customer', api)

  const { body }: { body: Follower } = await api
    .post(`${apiURLs.users}/${userID}/follows/${follows}`)
    .set('Cookie', `token=${token}`)
    .send({ userID, follows })

  return { ...body, token }
}

export const createOneAddress = async (role: string): Promise<{ addedAddress: Address; token: string; userID: number}> => {
  const { token, userID } = await loginAs(role, api)

  const { body } = await api
    .post(apiURLs.addresses)
    .set('Cookie', `token=${token}`)
    .send(await newAddress())

  return { addedAddress: body, token, userID }
}

export const createOneUserAddress = async (): Promise<UserAddress & { token: string}> => {
  const { addedAddress } = await createOneAddress('admin')
  const { userID, token } = await loginAs('customer', api)

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
  const { token } = await loginAs('customer', api)

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
  const { token } = await loginAs(role, api)

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
  const { token } = await loginAs(role, api)

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
  const { token, userID } = await loginAs(role, api)

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

export const newRating = (productID: number): RatingCreateInput => ({
  title: `New Rating ${(new Date().getTime()).toString()}`,
  stars: 4,
  productID
})

export const createOneRating = async (): Promise<Rating & { token: string }> => {
  const { token } = await loginAs('customer', api)
  const { addedProduct } = await createOneProduct('admin')

  const { body }: { body: Rating } = await api
    .post(apiURLs.ratings)
    .set('Cookie', `token=${token}`)
    .send(newRating(addedProduct.productID))

  return { ...body, token }
}

export const newRatingComment = (ratingID: number): RatingCommentCreateInput => ({
  content: `New RatingComment ${(new Date().getTime()).toString()}`,
  ratingID
})

export const createOneRatingComment = async (): Promise<RatingComment & { token: string }> => {
  const { token } = await loginAs('customer', api)
  const { ratingID } = await createOneRating()

  const { body }: { body: RatingComment } = await api
    .post(`${apiURLs.ratings}/comments`)
    .set('Cookie', `token=${token}`)
    .send(newRatingComment(ratingID))

  return { ...body, token }
}

export const newQuestion = (productID: number): QuestionCreateInput => ({
  content: `New Question ${(new Date().getTime()).toString()}`,
  productID
})

export const createOneQuestion = async (): Promise<Question & { token: string }> => {
  const { token } = await loginAs('customer', api)
  const { addedProduct } = await createOneProduct('admin')

  const { body }: { body: Question } = await api
    .post(apiURLs.questions)
    .set('Cookie', `token=${token}`)
    .send(newQuestion(addedProduct.productID))

  return { ...body, token }
}

export const newAnswer = (questionID: number): AnswerCreateInput => ({
  content: `New Answer ${(new Date().getTime()).toString()}`,
  questionID
})

export const createOneAnswer = async (): Promise<Answer & { token: string }> => {
  const { token } = await loginAs('customer', api)
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
  const { token } = await loginAs('customer', api)
  const { answerID } = await createOneAnswer()

  const { body }: { body: AnswerComment } = await api
    .post(`${apiURLs.answers}/comments`)
    .set('Cookie', `token=${token}`)
    .send(newAnswerComment(answerID))

  return { ...body, token }
}

export const newGroup = (name?: string): GroupInput => ({
  name: name ?? `New Group ${(new Date().getTime()).toString()}`
})

export const createOneGroup = async (role: string, name?: string): Promise<{ addedGroup: Group; token: string}> => {
  const { token } = await loginAs(role, api)

  const { body } = await api
    .post(apiURLs.groups)
    .set('Cookie', `token=${token}`)
    .send(newGroup(name))

  return { addedGroup: body, token }
}

export const newGroupProduct = (groupID: number, productID: number, value?: string): GroupProduct => ({
  value: value ?? `New GroupProduct ${(new Date().getTime()).toString()}`,
  groupID,
  productID
})

export const createOneGroupProduct = async (role: string, name?: string): Promise<{ addedGroupProduct: GroupProduct; token: string}> => {
  const { addedGroup, token } = await createOneGroup(role)
  const { addedProduct } = await createOneProduct(role)

  const { body } = await api
    .post(`${apiURLs.groups}/${addedGroup.groupID}/product/${addedProduct.productID}`)
    .set('Cookie', `token=${token}`)
    .send(newGroupProduct(addedGroup.groupID, addedProduct.productID, name))

  return { addedGroupProduct: body, token }
}

export const newParameter = (name?: string): ParameterInput => ({
  name: name ?? `New Parameter ${(new Date().getTime()).toString()}`
})

export const createOneParameter = async (role: string, name?: string): Promise<{ addedParameter: Parameter; token: string}> => {
  const { token } = await loginAs(role, api)

  const { body } = await api
    .post(apiURLs.parameters)
    .set('Cookie', `token=${token}`)
    .send(newParameter(name))

  return { addedParameter: body, token }
}
