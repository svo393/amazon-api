import path from 'path'
import { flatten, omit } from 'ramda'
import supertest from 'supertest'
import app from '../../src/app'
import { Address, Answer, CartProduct, Invoice, List, ObjIndexed, Order, Product, Question, Review, ReviewComment, UserAddress } from '../../src/types'
import { apiURLs } from '../../src/utils/constants'
import { db } from '../../src/utils/db'
import { createOneCategory, createOneParameter, createOneVendor, loginAs, populateUsers, purge } from '../testHelper'
import { initialProducts, initialUsers } from './seedData'

const api = supertest(app)

const seed = async (): Promise<void> => {
  try {
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
      await api
        .put(`${apiURLs.users}/${u.userID}`)
        .set('Cookie', `sessionID=${u.sessionID}`)
        .send(omit([ 'email', 'password', 'userID', 'sessionID' ], u))
    }))

    await Promise.all(users.map(async (u) => {
      const nameMatch = /^\w+?(?=@)/.exec(u.email)

      nameMatch && u.avatar && await api
        .post(`${apiURLs.users}/${u.userID}/upload`)
        .set('Cookie', `sessionID=${u.sessionID}`)
        .attach('userAvatar', path.join(
          __dirname, `images/avatars/${nameMatch[0]}.jpg`
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

    await api
      .post(`${apiURLs.users}/${users[0].userID}/follows/${users[3].userID}`)
      .set('Cookie', `sessionID=${users[0].sessionID}`)
      .send({ userID: users[0].userID, follows: users[3].userID })

    await api
      .post(`${apiURLs.users}/${users[1].userID}/follows/${users[2].userID}`)
      .set('Cookie', `sessionID=${users[1].sessionID}`)
      .send({ userID: users[0].userID, follows: users[3].userID })

    await api
      .post(`${apiURLs.users}/${users[2].userID}/follows/${users[3].userID}`)
      .set('Cookie', `sessionID=${users[2].sessionID}`)
      .send({ userID: users[0].userID, follows: users[3].userID })

    await api
      .post(`${apiURLs.users}/${users[1].userID}/follows/${users[0].userID}`)
      .set('Cookie', `sessionID=${users[1].sessionID}`)
      .send({ userID: users[0].userID, follows: users[3].userID })

    const allProductParameterNames = new Set<string>()

    Object.entries(initialProducts.Desktops.Acer[0])
      .forEach((ip) => ip[1].productParameters
        .forEach((pp) => allProductParameterNames.add(pp.name)))

    const parameters = await Promise.all(Array.from(allProductParameterNames).map(async (pp) => {
      const { addedParameter } = await createOneParameter('admin', pp, adminSessionID)
      return [ addedParameter.name, addedParameter.parameterID ]
    }))

    const products = flatten(await Promise.all(Object.entries(initialProducts).map(async (c) => {
      const { sessionID, userID } = await loginAs('admin')
      const { addedCategory } = await createOneCategory('admin', c[0])

      return await Promise.all(Object.entries(c[1]).map(async (v) => {
        const { addedVendor } = await createOneVendor('admin', v[0])

        return await Promise.all(Object.entries(v[1]).map(async (g) => {
          const bodies = []

          let { body }: { body: Product } = await api
            .post(apiURLs.products)
            .set('Cookie', `sessionID=${sessionID}`)
            .send({
              ...omit([
                'reviews',
                'questions',
                'media',
                'productParameters'
              ], g[1][0]),
              userID,
              categoryID: addedCategory.categoryID,
              vendorID: addedVendor.vendorID,
              productParameters: g[1][0].productParameters.map((pp) => {
                const parameter: any = parameters.find((p) => p[0] === pp.name)
                return { parameterID: parameter[1], value: pp.value }
              })
            })
          bodies.push(body)
          const groupID = body.groupID

          bodies.push(await Promise.all(g[1].map(async (p, i) => {
            if (i !== 0) {
              const result: { body: Product } = await api
                .post(apiURLs.products)
                .set('Cookie', `sessionID=${sessionID}`)
                .send({
                  ...omit([
                    'reviews',
                    'questions',
                    'media',
                    'productParameters'
                  ], p),
                  userID,
                  categoryID: addedCategory.categoryID,
                  vendorID: addedVendor.vendorID,
                  groupID,
                  productParameters: p.productParameters.map((pp) => {
                    const parameter: any = parameters.find((par) => {
                      return par[0] === pp.name
                    })
                    return { parameterID: parameter[1], value: pp.value }
                  })
                })
              body = result.body
            }

            if (p.media !== undefined) {
              const uploadAPI = api
                .post(`${apiURLs.products}/${body.productID}/upload`)
                .set('Cookie', `sessionID=${sessionID}`)

              const mediaRange = [ ...Array(p.media).keys() ]

              mediaRange.forEach((m) => {
                uploadAPI
                  .attach('productImages', path.join(
                    __dirname, `images/products/${i}_${m}.jpg`
                  ))
              })
              await uploadAPI
            }

            if (p.reviews !== undefined) {
              await Promise.all(p.reviews.map(async (r) => {
                const sessionID = users[r.author].sessionID

                const { body }: { body: Review } = await api
                  .post(`${apiURLs.groups}/${groupID}/reviews`)
                  .set('Cookie', `sessionID=${sessionID}`)
                  .send(omit([ 'author', 'comments', 'mediaFiles' ], r))

                await api
                  .put(`${apiURLs.reviews}/${body.reviewID}`)
                  .set('Cookie', `sessionID=${adminSessionID}`)
                  .send({ isVerified: true, moderationStatus: 'APPROVED' })

                if (r.media !== undefined) {
                  const uploadAPI = api
                    .post(`${apiURLs.reviews}/${body.reviewID}/upload`)
                    .set('Cookie', `sessionID=${sessionID}`)

                  r.mediaFiles !== undefined && r.mediaFiles.map((m) => {
                    uploadAPI
                      .attach('reviewImages', path.join(
                        __dirname, `images/reviews/${m}.jpg`
                      ))
                  })
                  await uploadAPI
                }

                if (r.comments !== undefined) {
                  await Promise.all(r.comments.map(async (cm: any) => {
                    const sessionID = users[cm.author].sessionID

                    const reviewComment: { body: ReviewComment } = await api
                      .post(`${apiURLs.reviews}/${body.reviewID}/comments`)
                      .set('Cookie', `sessionID=${sessionID}`)
                      .send(omit([ 'author' ], cm))

                    await api
                      .put(`${apiURLs.reviewComments}/${reviewComment.body.reviewCommentID}`)
                      .set('Cookie', `sessionID=${adminSessionID}`)
                      .send({ moderationStatus: 'APPROVED' })
                  }))
                }
              }))
            }

            if (p.questions !== undefined) {
              await Promise.all(p.questions.map(async (q: any) => {
                const sessionID = users[q.author].sessionID

                const { body }: { body: Question } = await api
                  .post(`${apiURLs.groups}/${groupID}/questions`)
                  .set('Cookie', `sessionID=${sessionID}`)
                  .send(omit([ 'author', 'answers', 'mediaFiles' ], q))

                // await api
                //   .put(`${apiURLs.questions}/${body.questionID}`)
                //   .set('Cookie', `sessionID=${adminSessionID}`)
                //   .send({ moderationStatus: 'APPROVED' })

                if (q.media !== undefined) {
                  const uploadAPI = api
                    .post(`${apiURLs.questions}/${body.questionID}/upload`)
                    .set('Cookie', `sessionID=${sessionID}`)

                  q.mediaFiles !== undefined && q.mediaFiles.map((m: number) => {
                    uploadAPI
                      .attach('questionImages', path.join(
                        __dirname, `images/questions/${m}.jpg`
                      ))
                  })
                  await uploadAPI
                }

                if (q.answers !== undefined) {
                  await Promise.all(q.answers.map(async (a: any) => {
                    const sessionID = users[a.author].sessionID

                    const answer: { body: Answer } = await api
                      .post(`${apiURLs.questions}/${body.questionID}/answers`)
                      .set('Cookie', `sessionID=${sessionID}`)
                      .send(omit([ 'author', 'mediaFiles' ], a))

                    // await api
                    //   .put(`${apiURLs.answers}/${answer.body.answerID}`)
                    //   .set('Cookie', `sessionID=${adminSessionID}`)
                    //   .send({ moderationStatus: 'APPROVED' })

                    if (a.media !== undefined) {
                      const uploadAPI = api
                        .post(`${apiURLs.answers}/${answer.body.answerID}/upload`)
                        .set('Cookie', `sessionID=${sessionID}`)

                      a.mediaFiles !== undefined && a.mediaFiles.map((m: number) => {
                        uploadAPI
                          .attach('answerImages', path.join(
                            __dirname, `images/answers/${m}.jpg`
                          ))
                      })
                      await uploadAPI
                    }
                  }))
                }
              }))
            }
            return body
          })))
          return bodies
        }))
      }))
    })))

    const newList1: { body: List } = await api
      .post(apiURLs.lists)
      .set('Cookie', `sessionID=${users[0].sessionID}`)
      .send({ name: 'Wishlist' })

    await api
      .post(
        `${apiURLs.lists}/${newList1.body.listID}/products/${products[0].productID}`
      )
      .set('Cookie', `sessionID=${users[0].sessionID}`)

    await api
      .post(
        `${apiURLs.lists}/${newList1.body.listID}/products/${products[1].productID}`
      )
      .set('Cookie', `sessionID=${users[0].sessionID}`)

    const newList2: { body: List } = await api
      .post(apiURLs.lists)
      .set('Cookie', `sessionID=${users[2].sessionID}`)
      .send({ name: 'Stuff to buy' })

    await api
      .post(
        `${apiURLs.lists}/${newList2.body.listID}/products/${products[2].productID}`
      )
      .set('Cookie', `sessionID=${users[2].sessionID}`)

    const cartProduct1: { body: { cart: CartProduct[] } } = await api
      .post(`${apiURLs.users}/${users[0].userID}/cartProducts`)
      .set('Cookie', `sessionID=${users[0].sessionID}`)
      .send([ {
        qty: 1,
        productID: products[1].productID
      } ])

    const order1: { body: Order & Invoice } = await api
      .post(`${apiURLs.users}/${users[0].userID}/orders`)
      .set('Cookie', `sessionID=${users[0].sessionID}`)
      .send({
        addressID: (addresses.find((a) => a.userID === users[0].userID))?.addressID,
        details: 'Card 4242 4242 4242 4242',
        shippingMethod: 'DOOR',
        paymentMethod: 'CARD',
        cart: [ cartProduct1.body.cart[0] ]
      })

    // await api
    //   .put(`${apiURLs.orders}/${order1.body.orderID}`)
    //   .set('Cookie', `sessionID=${adminSessionID}`)
    //   .send({ orderStatus: 'DONE' })

    // await api
    //   .put(`${apiURLs.invoices}/${order1.body.invoiceID}`)
    //   .set('Cookie', `sessionID=${adminSessionID}`)
    //   .send({ invoiceStatus: 'DONE' })

    const cartProduct2: { body: { cart: CartProduct[] } } = await api
      .post(`${apiURLs.users}/${users[2].userID}/cartProducts`)
      .set('Cookie', `sessionID=${users[2].sessionID}`)
      .send([ {
        qty: 1,
        productID: products[0].productID
      } ])

    const order2: { body: Order & Invoice } = await api
      .post(`${apiURLs.users}/${users[2].userID}/orders`)
      .set('Cookie', `sessionID=${users[2].sessionID}`)
      .send({
        addressID: (addresses.find((a) => a.userID === users[2].userID))?.addressID,
        details: 'Take my money',
        shippingMethod: 'LOCKER',
        paymentMethod: 'CASH',
        cart: [ cartProduct2.body.cart[0] ]
      })

    // await api
    //   .put(`${apiURLs.orders}/${order2.body.orderID}`)
    //   .set('Cookie', `sessionID=${adminSessionID}`)
    //   .send({ orderStatus: 'DONE' })

    // await api
    //   .put(`${apiURLs.invoices}/${order2.body.invoiceID}`)
    //   .set('Cookie', `sessionID=${adminSessionID}`)
    //   .send({ invoiceStatus: 'DONE' })
  } catch (error) { console.error(error) }
}

seed().then(async () => await db.destroy())
