import path from 'path'
import { isEmpty, omit, pick } from 'ramda'
import supertest from 'supertest'
import app from '../../src/app'
import { Category, ObjIndexed, Parameter, Product, Question, Review, ReviewComment, Vendor } from '../../src/types'
import { apiURLs } from '../../src/utils/constants'
import { db } from '../../src/utils/db'
import { initialProducts, initialUsers } from './seedData'

const adminUser = {
  email: 'admin@example.com',
  password: 'yW%491f8UGYJ',
  name: 'Adminus Maximus'
}

const rootUser = {
  email: 'root@example.com',
  password: 'yW%491f8UGYJ',
  name: 'Root-Root'
}

const purge = async (): Promise<void> => {
  await db('invoices').del()
  await db('orderProducts').del()
  await db('orders').del()
  await db('cartProducts').del()
  await db('productParameters').del()
  await db('parameters').del()
  await db('groupVariations').del()
  await db('votes').del()
  await db('images').del()
  await db('answers').del()
  await db('questions').del()
  await db('reviewComments').del()
  await db('reviews').del()
  await db('listProducts').del()
  await db('productSizes').del()
  await db('products').del()
  await db('groups').del()
  await db('vendors').del()
  await db('categories').del()
  await db('lists').del()
  await db('userAddresses').del()
  await db('followers').del()
  await db('users').del()
}

const populateUsers = async (): Promise<void> => {
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

const loginAs = async (role: string): Promise<{sessionID: string; userID: number}> => {
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

const api = supertest(app)

export const createOneParameter = async (role: string, name?: string, sessionID?: string): Promise<{ addedParameter: Parameter; sessionID: string}> => {
  if (sessionID === undefined) sessionID = (await loginAs(role)).sessionID

  const { body } = await api
    .post(apiURLs.parameters)
    .set('Cookie', `sessionID=${sessionID}`)
    .send({ name })

  return { addedParameter: body, sessionID }
}

const createOneCategory = async (role: string, name?: string, parentCategoryID?: number): Promise<{ addedCategory: Category; sessionID: string}> => {
  const { sessionID } = await loginAs(role)

  const { body } = await api
    .post(apiURLs.categories)
    .set('Cookie', `sessionID=${sessionID}`)
    .send({ name, parentCategoryID })

  return { addedCategory: body, sessionID }
}

const createOneVendor = async (role: string, name?: string): Promise<{ addedVendor: Vendor; sessionID: string}> => {
  const { sessionID } = await loginAs(role)

  const { body } = await api
    .post(apiURLs.vendors)
    .set('Cookie', `sessionID=${sessionID}`)
    .send({ name })

  return { addedVendor: body, sessionID }
}

const seed = async (): Promise<void> => {
  await purge()
  await populateUsers()

  const { sessionID: adminSessionID } = await loginAs('admin')

  const users = await Promise.all(initialUsers.map(async (u) => {
    const res = await api
      .post(apiURLs.auth)
      .send({ email: u.email, password: u.password, name: u.name })

    return {
      ...u,
      userID: res.body.userID,
      sessionID: res.header['set-cookie'][0].split('; ')[0].slice(10)
    }
  }))

  await Promise.all(users.map(async (u) => {
    const data = pick([ 'avatar', 'info', 'cover' ], u)

    !isEmpty(data) && await api
      .put(`${apiURLs.auth}/${u.userID}`)
      .set('Cookie', `sessionID=${u.sessionID}`)
      .send(data)
  }))

  await Promise.all(users.map(async (u, i) => {
    u.avatar && await api
      .post(`${apiURLs.users}/${u.userID}/upload-avatar`)
      .set('Cookie', `sessionID=${u.sessionID}`)
      .attach('userAvatar', path.join(
        __dirname, `images/users/${i}/avatar.jpg`
      ))

    u.cover && await api
      .post(`${apiURLs.users}/${u.userID}/upload-cover`)
      .set('Cookie', `sessionID=${u.sessionID}`)
      .attach('userCover', path.join(
        __dirname, `images/users/${i}/cover.jpg`
      ))
  }))

  await Promise.all(users
    .filter((u) => u.address !== undefined)
    .map(async (u) =>
      (await api
        .post(apiURLs.addresses)
        .set('Cookie', `sessionID=${u.sessionID}`)
        .send({
          ...u.address as ObjIndexed,
          addressType: 'SHIPPING'
        })).body
    ))

  const allProductParameterNames = new Set<string>()

  Object.values(initialProducts)
    .forEach((c) => Object.values(c)
      .forEach((v) => (v as any[])
        .forEach((g) => (g.products as any[])
          .forEach((p) => (p.productParameters as any[] ?? [])
            .forEach((pp) => allProductParameterNames.add(pp.name))))))

  const parameters = await Promise.all(Array.from(allProductParameterNames).map(async (pp) => {
    const { addedParameter } = await createOneParameter('admin', pp, adminSessionID)
    return [ addedParameter.name, addedParameter.parameterID ]
  }))

  await Promise.all(Object.entries(initialProducts).map(async ([ catName, vendors ]) => {
    const { sessionID, userID } = await loginAs('admin')
    const { addedCategory } = await createOneCategory('admin', catName)

    return await Promise.all(Object.entries(vendors).map(async ([ vendorName, groups ]) => {
      const { addedVendor } = await createOneVendor('admin', vendorName)

      return await Promise.all((groups).map(async ({ questions, products }: any, groupIndex: number) => {
        const bodies: any[] = []
        const firstProduct = products[0]

        let { body }: { body: Product } = await api
          .post(apiURLs.products)
          .set('Cookie', `sessionID=${sessionID}`)
          .send({
            ...omit([
              'reviews',
              'media',
              'productParameters'
            ], firstProduct),
            userID,
            categoryID: addedCategory.categoryID,
            vendorID: addedVendor.vendorID,
            productParameters: firstProduct.productParameters?.map((pp: any) => {
              const parameter: any = parameters.find((par) => par[0] === pp.name)
              return { parameterID: parameter[1], value: pp.value }
            })
          })

        bodies.push(body)
        const groupID = body.groupID

        if (questions !== undefined) {
          await Promise.all(questions.map(async (q: any) => {
            const sessionID = users[q.author].sessionID

            const { body }: { body: Question } = await api
              .post(`${apiURLs.groups}/${groupID}/questions`)
              .set('Cookie', `sessionID=${sessionID}`)
              .send({ content: q.content })

            if (q.answers !== undefined) {
              await Promise.all(q.answers.map(async (a: any) => {
                const sessionID = users[a.author].sessionID

                await api
                  .post(`${apiURLs.questions}/${body.questionID}/answers`)
                  .set('Cookie', `sessionID=${sessionID}`)
                  .send({ content: a.content })
              }))
            }
          }))
        }

        bodies.push(await Promise.all(products.map(async (p: any, i: number) => {
          if (i !== 0) {
            const result: { body: Product } = await api
              .post(apiURLs.products)
              .set('Cookie', `sessionID=${sessionID}`)
              .send({
                ...omit([
                  'reviews',
                  'media',
                  'productParameters'
                ], p),
                userID,
                categoryID: addedCategory.categoryID,
                vendorID: addedVendor.vendorID,
                groupID,
                productParameters: p.productParameters?.map((pp: any) => {
                  const parameter: any = parameters
                    .find((par) => par[0] === pp.name)
                  return { parameterID: parameter[1], value: pp.value }
                })
              })
            body = result.body

            if (p.media) {
              const uploadAPI = api
                .post(`${apiURLs.products}/${body.productID}/upload`)
                .set('Cookie', `sessionID=${sessionID}`)

              const mediaRange = [ ...Array(p.media).keys() ]

              mediaRange.forEach((m) => {
                uploadAPI
                  .attach('productImages', path.join(
                    __dirname, `images/products/${catName}/${vendorName}/${groupIndex}/${i}/${m}.jpg`
                  ))
              })
              await uploadAPI
            }

            if (p.reviews !== undefined) {
              await Promise.all(p.reviews.map(async (r: any, reviewIndex: number) => {
                const sessionID = users[r.author].sessionID

                const { body: reviewBody }: { body: Review } = await api
                  .post(`${apiURLs.groups}/${groupID}/reviews`)
                  .set('Cookie', `sessionID=${sessionID}`)
                  .send({
                    ...omit([ 'author', 'comments' ], r),
                    productID: body.productID
                  })

                if (r.media) {
                  const uploadAPI = api
                    .post(`${apiURLs.reviews}/${reviewBody.reviewID}/upload`)
                    .set('Cookie', `sessionID=${sessionID}`)

                  const mediaRange = [ ...Array(r.media).keys() ]

                  mediaRange.forEach((m) => {
                    uploadAPI
                      .attach('reviewImages', path.join(
                        __dirname, `images/products/${catName}/${vendorName}/${groupIndex}/${i}/reviews/${reviewIndex}/${m}.jpg`
                      ))
                  })
                  await uploadAPI
                }

                if (r.comments !== undefined) {
                  const reviewComments: any = []

                  await Promise.all(r.comments.map(async (rc: any) => {
                    const sessionID = users[rc.author].sessionID

                    const reviewComment: { body: ReviewComment } = await api
                      .post(`${apiURLs.reviews}/${reviewBody.reviewID}/comments`)
                      .set('Cookie', `sessionID=${sessionID}`)
                      .send({
                        ...omit([ 'author' ], rc),
                        parentReviewCommentID: rc.replyTo !== undefined
                          ? reviewComments[rc.replyTo].reviewCommentID
                          : undefined
                      })

                    reviewComments.push(reviewComment.body)
                  }))
                }
              }))
            }
          }

          return body
        })))
        return bodies
      }))
    }))
  }))

  //   const newList1: { body: List } = await api
  //     .post(apiURLs.lists)
  //     .set('Cookie', `sessionID=${users[0].sessionID}`)
  //     .send({ name: 'Wishlist' })

  //   await api
  //     .post(
  //       `${apiURLs.lists}/${newList1.body.listID}/products/${products[0].productID}`
  //     )
  //     .set('Cookie', `sessionID=${users[0].sessionID}`)

  //   await api
  //     .post(
  //       `${apiURLs.lists}/${newList1.body.listID}/products/${products[1].productID}`
  //     )
  //     .set('Cookie', `sessionID=${users[0].sessionID}`)

  //   const newList2: { body: List } = await api
  //     .post(apiURLs.lists)
  //     .set('Cookie', `sessionID=${users[2].sessionID}`)
  //     .send({ name: 'Stuff to buy' })

  //   await api
  //     .post(
  //       `${apiURLs.lists}/${newList2.body.listID}/products/${products[2].productID}`
  //     )
  //     .set('Cookie', `sessionID=${users[2].sessionID}`)

  //   const cartProduct1: { body: { cart: CartProduct[] } } = await api
  //     .post(`${apiURLs.users}/${users[0].userID}/cartProducts`)
  //     .set('Cookie', `sessionID=${users[0].sessionID}`)
  //     .send([ {
  //       qty: 1,
  //       productID: products[1].productID
  //     } ])

  //   const order1: { body: Order & Invoice } = await api
  //     .post(`${apiURLs.users}/${users[0].userID}/orders`)
  //     .set('Cookie', `sessionID=${users[0].sessionID}`)
  //     .send({
  //       addressID: (addresses.find((a) => a.userID === users[0].userID))?.addressID,
  //       details: 'Card 4242 4242 4242 4242',
  //       shippingMethod: 'DOOR',
  //       shippingCost: 4.99,
  //       paymentMethod: 'CARD',
  //       cart: [ cartProduct1.body.cart[0] ]
  //     })

  //   // await api
  //   //   .put(`${apiURLs.orders}/${order1.body.orderID}`)
  //   //   .set('Cookie', `sessionID=${adminSessionID}`)
  //   //   .send({ orderStatus: 'DONE' })

  //   // await api
  //   //   .put(`${apiURLs.invoices}/${order1.body.invoiceID}`)
  //   //   .set('Cookie', `sessionID=${adminSessionID}`)
  //   //   .send({ invoiceStatus: 'DONE' })

  //   const cartProduct2: { body: { cart: CartProduct[] } } = await api
  //     .post(`${apiURLs.users}/${users[2].userID}/cartProducts`)
  //     .set('Cookie', `sessionID=${users[2].sessionID}`)
  //     .send([ {
  //       qty: 1,
  //       productID: products[0].productID
  //     } ])

  //   const order2: { body: Order & Invoice } = await api
  //     .post(`${apiURLs.users}/${users[2].userID}/orders`)
  //     .set('Cookie', `sessionID=${users[2].sessionID}`)
  //     .send({
  //       addressID: (addresses.find((a) => a.userID === users[2].userID))?.addressID,
  //       details: 'Take my money',
  //       shippingMethod: 'LOCKER',
  //       shippingCost: 4.99,
  //       paymentMethod: 'CASH',
  //       cart: [ cartProduct2.body.cart[0] ]
  //     })

  //   // await api
  //   //   .put(`${apiURLs.orders}/${order2.body.orderID}`)
  //   //   .set('Cookie', `sessionID=${adminSessionID}`)
  //   //   .send({ orderStatus: 'DONE' })

  //   // await api
  //   //   .put(`${apiURLs.invoices}/${order2.body.invoiceID}`)
  //   //   .set('Cookie', `sessionID=${adminSessionID}`)
  //   //   .send({ invoiceStatus: 'DONE' })
}

seed()
  .then(async () => await db.destroy())
  .catch((error) => console.error(error))
