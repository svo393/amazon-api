import path from 'path'
import { flatten, isEmpty, omit, pick } from 'ramda'
import supertest from 'supertest'
import app from '../../src/app'
import { Address, Answer, CartProduct, Invoice, List, ObjIndexed, Order, Product, Question, Review, ReviewComment, UserAddress } from '../../src/types'
import { apiURLs } from '../../src/utils/constants'
import { db } from '../../src/utils/db'
import { createOneCategory, createOneParameter, createOneVendor, loginAs } from '../testHelper'
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

const api = supertest(app)

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

  const addresses: (Address & UserAddress)[] = await Promise.all(users
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

  //   const allProductParameterNames = new Set<string>()

  //   Object.entries(initialProducts['All-in-Ones Computers'].Acer[0])
  //     .forEach((ip) => ip[1].productParameters
  //       .forEach((pp) => allProductParameterNames.add(pp.name)))

  //   const parameters = await Promise.all(Array.from(allProductParameterNames).map(async (pp) => {
  //     const { addedParameter } = await createOneParameter('admin', pp, adminSessionID)
  //     return [ addedParameter.name, addedParameter.parameterID ]
  //   }))

  //   const products = flatten(await Promise.all(Object.entries(initialProducts).map(async (c) => {
  //     const { sessionID, userID } = await loginAs('admin')
  //     const { addedCategory } = await createOneCategory('admin', c[0])

  //     return await Promise.all(Object.entries(c[1]).map(async (v) => {
  //       const { addedVendor } = await createOneVendor('admin', v[0])

  //       return await Promise.all(Object.entries(v[1]).map(async (g) => {
  //         const bodies = []

  //         let { body }: { body: Product } = await api
  //           .post(apiURLs.products)
  //           .set('Cookie', `sessionID=${sessionID}`)
  //           .send({
  //             ...omit([
  //               'reviews',
  //               'questions',
  //               'media',
  //               'productParameters'
  //             ], g[1][0]),
  //             userID,
  //             categoryID: addedCategory.categoryID,
  //             vendorID: addedVendor.vendorID,
  //             productParameters: g[1][0].productParameters.map((pp) => {
  //               const parameter: any = parameters.find((p) => p[0] === pp.name)
  //               return { parameterID: parameter[1], value: pp.value }
  //             })
  //           })
  //         bodies.push(body)
  //         const groupID = body.groupID

  //         bodies.push(await Promise.all(g[1].map(async (p, i) => {
  //           if (i !== 0) {
  //             const result: { body: Product } = await api
  //               .post(apiURLs.products)
  //               .set('Cookie', `sessionID=${sessionID}`)
  //               .send({
  //                 ...omit([
  //                   'reviews',
  //                   'questions',
  //                   'media',
  //                   'productParameters'
  //                 ], p),
  //                 userID,
  //                 categoryID: addedCategory.categoryID,
  //                 vendorID: addedVendor.vendorID,
  //                 groupID,
  //                 productParameters: p.productParameters.map((pp) => {
  //                   const parameter: any = parameters.find((par) => {
  //                     return par[0] === pp.name
  //                   })
  //                   return { parameterID: parameter[1], value: pp.value }
  //                 })
  //               })
  //             body = result.body
  //           }

  //           if (p.media !== undefined) {
  //             const uploadAPI = api
  //               .post(`${apiURLs.products}/${body.productID}/upload`)
  //               .set('Cookie', `sessionID=${sessionID}`)

  //             const mediaRange = [ ...Array(p.media).keys() ]

  //             mediaRange.forEach((m) => {
  //               uploadAPI
  //                 .attach('productImages', path.join(
  //                   __dirname, `images/products/${i}_${m}.jpg`
  //                 ))
  //             })
  //             await uploadAPI
  //           }

  //           if (p.reviews !== undefined) {
  //             await Promise.all(p.reviews.map(async (r) => {
  //               const sessionID = users[r.author].sessionID

  //               const { body }: { body: Review } = await api
  //                 .post(`${apiURLs.groups}/${groupID}/reviews`)
  //                 .set('Cookie', `sessionID=${sessionID}`)
  //                 .send(omit([ 'author', 'comments', 'mediaFiles' ], r))

  //               await api
  //                 .put(`${apiURLs.reviews}/${body.reviewID}`)
  //                 .set('Cookie', `sessionID=${adminSessionID}`)
  //                 .send({ isVerified: true, moderationStatus: 'APPROVED' })

  //               if (r.media !== undefined) {
  //                 const uploadAPI = api
  //                   .post(`${apiURLs.reviews}/${body.reviewID}/upload`)
  //                   .set('Cookie', `sessionID=${sessionID}`)

  //                 r.mediaFiles !== undefined && r.mediaFiles.map((m) => {
  //                   uploadAPI
  //                     .attach('reviewImages', path.join(
  //                       __dirname, `images/reviews/${m}.jpg`
  //                     ))
  //                 })
  //                 await uploadAPI
  //               }

  //               if (r.comments !== undefined) {
  //                 await Promise.all(r.comments.map(async (cm: any) => {
  //                   const sessionID = users[cm.author].sessionID

  //                   const reviewComment: { body: ReviewComment } = await api
  //                     .post(`${apiURLs.reviews}/${body.reviewID}/comments`)
  //                     .set('Cookie', `sessionID=${sessionID}`)
  //                     .send(omit([ 'author' ], cm))

  //                   await api
  //                     .put(`${apiURLs.reviewComments}/${reviewComment.body.reviewCommentID}`)
  //                     .set('Cookie', `sessionID=${adminSessionID}`)
  //                     .send({ moderationStatus: 'APPROVED' })
  //                 }))
  //               }
  //             }))
  //           }

  //           if (p.questions !== undefined) {
  //             await Promise.all(p.questions.map(async (q: any) => {
  //               const sessionID = users[q.author].sessionID

  //               const { body }: { body: Question } = await api
  //                 .post(`${apiURLs.groups}/${groupID}/questions`)
  //                 .set('Cookie', `sessionID=${sessionID}`)
  //                 .send(omit([ 'author', 'answers', 'mediaFiles' ], q))

  //               // await api
  //               //   .put(`${apiURLs.questions}/${body.questionID}`)
  //               //   .set('Cookie', `sessionID=${adminSessionID}`)
  //               //   .send({ moderationStatus: 'APPROVED' })

  //               if (q.media !== undefined) {
  //                 const uploadAPI = api
  //                   .post(`${apiURLs.questions}/${body.questionID}/upload`)
  //                   .set('Cookie', `sessionID=${sessionID}`)

  //                 q.mediaFiles !== undefined && q.mediaFiles.map((m: number) => {
  //                   uploadAPI
  //                     .attach('questionImages', path.join(
  //                       __dirname, `images/questions/${m}.jpg`
  //                     ))
  //                 })
  //                 await uploadAPI
  //               }

  //               if (q.answers !== undefined) {
  //                 await Promise.all(q.answers.map(async (a: any) => {
  //                   const sessionID = users[a.author].sessionID

  //                   const answer: { body: Answer } = await api
  //                     .post(`${apiURLs.questions}/${body.questionID}/answers`)
  //                     .set('Cookie', `sessionID=${sessionID}`)
  //                     .send(omit([ 'author', 'mediaFiles' ], a))

  //                   // await api
  //                   //   .put(`${apiURLs.answers}/${answer.body.answerID}`)
  //                   //   .set('Cookie', `sessionID=${adminSessionID}`)
  //                   //   .send({ moderationStatus: 'APPROVED' })

  //                   if (a.media !== undefined) {
  //                     const uploadAPI = api
  //                       .post(`${apiURLs.answers}/${answer.body.answerID}/upload`)
  //                       .set('Cookie', `sessionID=${sessionID}`)

  //                     a.mediaFiles !== undefined && a.mediaFiles.map((m: number) => {
  //                       uploadAPI
  //                         .attach('answerImages', path.join(
  //                           __dirname, `images/answers/${m}.jpg`
  //                         ))
  //                     })
  //                     await uploadAPI
  //                   }
  //                 }))
  //               }
  //             }))
  //           }
  //           return body
  //         })))
  //         return bodies
  //       }))
  //     }))
  //   })))

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
