import supertest from 'supertest'
import app from '../src/app'
import { Address, AddressCreateInput, AddressType, AddressTypeInput, Category, CategoryCreateInput, Follower, List, ListCreateInput, ListProduct, Product, ProductPublicData, Role, RoleInput, ShippingMethod, ShippingMethodInput, User, UserAddress, Vendor, VendorInput, Rating, RatingCreateInput } from '../src/types'
import { db } from '../src/utils/db'
import StatusError from '../src/utils/StatusError'
import { products } from './seedData'

const api = supertest(app)

export const apiURLs = {
  categories: '/api/categories',
  products: '/api/products',
  users: '/api/users',
  vendors: '/api/vendors',
  roles: '/api/roles',
  shippingMethods: '/api/shipping-methods',
  addressTypes: '/api/address-types',
  addresses: '/api/addresses',
  followers: '/api/followers',
  userAddresses: '/api/user-addresses',
  lists: '/api/lists',
  ratings: '/api/ratings'
}

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

export const createOneFollower = async (): Promise<Follower & { token: string}> => {
  const user1 = await getUserByEmail('admin@example.com')
  const { userID: user2ID, token } = await loginAs('customer', api)

  const { body }: { body: Follower } = await api
    .post(apiURLs.followers)
    .set('Cookie', `token=${token}`)
    .send({ userID: user2ID, follows: user1.userID })

  return { ...body, token }
}

export const createOneAddress = async (role: string): Promise<{ addedAddress: Address; token: string}> => {
  const { token } = await loginAs(role, api)

  const { body } = await api
    .post(apiURLs.addresses)
    .set('Cookie', `token=${token}`)
    .send(await newAddress())

  return { addedAddress: body, token }
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

// export const createOneRating = async (): Promise<Rating> => {
//   const { token } = await loginAs('customer', api)
//   const { addedProduct } = await createOneProduct('admin')

//   const { body }: { body: Rating } = await api
//     .post(apiURLs.ratings)
//     .set('Cookie', `token=${token}`)
//     .send(newRating(addedProduct.productID))

//   return body
// }
