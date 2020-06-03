import path from 'path'
import R from 'ramda'
import supertest from 'supertest'
import app from '../../src/app'
import { AddressType, Answer, AnswerComment, CartProduct, List, Order, OrderStatus, PaymentMethod, Product, Question, Rating, RatingComment, ShippingMethod, InvoiceStatus, Invoice } from '../../src/types'
import { apiURLs } from '../../src/utils/constants'
import { db } from '../../src/utils/db'
import { createOneCategory, createOneVendor, loginAs, populateUsers, purge } from '../testHelper'
import { initialProducts, initialUsers } from './seedData'

const api = supertest(app)

const seed = async (): Promise<void> => {
  try {
    await purge()
    await populateUsers()

    const { token: adminToken } = await loginAs('admin')

    const users = await Promise.all(initialUsers.map(async (u) => {
      const res = await api
        .post(apiURLs.users)
        .send({ email: u.email, password: u.password })

      return {
        ...u,
        userID: res.body.userID,
        token: res.header['set-cookie'][0].split('; ')[0].slice(6)
      }
    }))

    await Promise.all(users.map(async (u) => {
      await api
        .put(`${apiURLs.users}/${u.userID}`)
        .set('Cookie', `token=${u.token}`)
        .send(R.omit([ 'email', 'password', 'userID', 'token' ], u))
    }))

    const addressTypes: { body: AddressType[] } = await api
      .get(apiURLs.addressTypes)

    const shippingAddressTypeID = addressTypes.body.find((at) => at.name === 'SHIPPING')

    await Promise.all(users.map(async (u) => {
      const nameMatch = /^\w+?(?=@)/.exec(u.email)

      nameMatch && u.avatar && await api
        .post(`${apiURLs.users}/${u.userID}/upload`)
        .set('Cookie', `token=${u.token}`)
        .attach('userAvatar', path.join(
          __dirname, `images/avatars/${nameMatch[0]}.jpg`
        ))
    }))

    await Promise.all(users.map(async (u) => {
      await api
        .post(apiURLs.addresses)
        .set('Cookie', `token=${u.token}`)
        .send({
          addr: u.address,
          addressTypeID: shippingAddressTypeID?.addressTypeID
        })
    }))

    await api
      .post(`${apiURLs.users}/${users[0].userID}/follows/${users[3].userID}`)
      .set('Cookie', `token=${users[0].token}`)
      .send({ userID: users[0].userID, follows: users[3].userID })

    await api
      .post(`${apiURLs.users}/${users[1].userID}/follows/${users[2].userID}`)
      .set('Cookie', `token=${users[1].token}`)
      .send({ userID: users[0].userID, follows: users[3].userID })

    await api
      .post(`${apiURLs.users}/${users[2].userID}/follows/${users[3].userID}`)
      .set('Cookie', `token=${users[2].token}`)
      .send({ userID: users[0].userID, follows: users[3].userID })

    await api
      .post(`${apiURLs.users}/${users[1].userID}/follows/${users[0].userID}`)
      .set('Cookie', `token=${users[1].token}`)
      .send({ userID: users[0].userID, follows: users[3].userID })

    const products = R.flatten(await Promise.all(Object.entries(initialProducts).map(async (c) => {
      const { token, userID } = await loginAs('admin')
      const { addedCategory } = await createOneCategory('admin', c[0])

      return await Promise.all(Object.entries(c[1]).map(async (v) => {
        const { addedVendor } = await createOneVendor('admin', v[0])

        return await Promise.all(Object.entries(v[1]).map(async (g) => {
          let groupID: number

          return await Promise.all(g[1].map(async (p, i) => {
            const { body }: { body: Product } = await api
              .post(apiURLs.products)
              .set('Cookie', `token=${token}`)
              .send({
                ...R.omit([ 'ratings', 'questions' ], p),
                userID,
                categoryID: addedCategory.categoryID,
                vendorID: addedVendor.vendorID,
                groupID
              })
            groupID = body.groupID

            if (p.media) {
              const uploadAPI = api
                .post(`${apiURLs.products}/${body.productID}/upload`)
                .set('Cookie', `token=${token}`)

              const mediaRange = [ ...Array(p.media).keys() ]

              mediaRange.map((m) => {
                uploadAPI
                  .attach('productMedia', path.join(
                    __dirname, `images/products/${i}_${m}.jpg`
                  ))
              })
              await uploadAPI
            }

            if (p.ratings) {
              await Promise.all(p.ratings.map(async (r) => {
                const token = users[r.author].token

                const { body }: { body: Rating } = await api
                  .post(apiURLs.ratings)
                  .set('Cookie', `token=${token}`)
                  .send({
                    ...R.omit([ 'author', 'comments', 'mediaFiles' ], r),
                    groupID
                  })

                await api
                  .put(`${apiURLs.ratings}/${body.ratingID}`)
                  .set('Cookie', `token=${adminToken}`)
                  .send({ isVerified: true, isApproved: true })

                if (r.media) {
                  const uploadAPI = api
                    .post(`${apiURLs.ratings}/${body.ratingID}/upload`)
                    .set('Cookie', `token=${token}`)

                  r.mediaFiles.map((m) => {
                    uploadAPI
                      .attach('ratingMedia', path.join(
                        __dirname, `images/ratings/${m}.jpg`
                      ))
                  })
                  await uploadAPI
                }

                if (r.comments) {
                  await Promise.all(r.comments.map(async (cm: any) => {
                    const token = users[cm.author].token

                    const ratingComment: { body: RatingComment } = await api
                      .post(`${apiURLs.ratings}/comments`)
                      .set('Cookie', `token=${token}`)
                      .send({
                        ...R.omit([ 'author', 'mediaFiles' ], cm),
                        ratingID: body.ratingID
                      })

                    await api
                      .put(`${apiURLs.ratingComments}/${ratingComment.body.ratingCommentID}`)
                      .set('Cookie', `token=${adminToken}`)
                      .send({ isApproved: true })

                    if (cm.media) {
                      const uploadAPI = api
                        .post(`${apiURLs.ratings}/${body.ratingID}/comments/${ratingComment.body.ratingCommentID}/upload`)
                        .set('Cookie', `token=${token}`)

                      cm.mediaFiles.map((m: number) => {
                        uploadAPI
                          .attach('ratingCommentMedia', path.join(
                            __dirname, `images/ratingComments/${m}.jpg`
                          ))
                      })
                      await uploadAPI
                    }
                  }))
                }
              }))
            }

            if (p.questions) {
              await Promise.all(p.questions.map(async (q: any) => {
                const token = users[q.author].token

                const { body }: { body: Question } = await api
                  .post(apiURLs.questions)
                  .set('Cookie', `token=${token}`)
                  .send({
                    ...R.omit([ 'author', 'answers', 'mediaFiles' ], q),
                    groupID
                  })

                await api
                  .put(`${apiURLs.questions}/${body.questionID}`)
                  .set('Cookie', `token=${adminToken}`)
                  .send({ isApproved: true })

                if (q.media) {
                  const uploadAPI = api
                    .post(`${apiURLs.questions}/${body.questionID}/upload`)
                    .set('Cookie', `token=${token}`)

                  q.mediaFiles.map((m: number) => {
                    uploadAPI
                      .attach('questionMedia', path.join(
                        __dirname, `images/questions/${m}.jpg`
                      ))
                  })
                  await uploadAPI
                }

                if (q.answers) {
                  await Promise.all(q.answers.map(async (a: any) => {
                    const token = users[a.author].token

                    const answer: { body: Answer } = await api
                      .post(`${apiURLs.questions}/answers`)
                      .set('Cookie', `token=${token}`)
                      .send({
                        ...R.omit([ 'author', 'mediaFiles' ], a),
                        questionID: body.questionID
                      })

                    await api
                      .put(`${apiURLs.answers}/${answer.body.answerID}`)
                      .set('Cookie', `token=${adminToken}`)
                      .send({ isApproved: true })

                    if (a.media) {
                      const uploadAPI = api
                        .post(`${apiURLs.answers}/${answer.body.answerID}/upload`)
                        .set('Cookie', `token=${token}`)

                      a.mediaFiles.map((m: number) => {
                        uploadAPI
                          .attach('answerMedia', path.join(
                            __dirname, `images/answers/${m}.jpg`
                          ))
                      })
                      await uploadAPI
                    }

                    if (a.comments) {
                      await Promise.all(a.comments.map(async (ac: any) => {
                        const token = users[ac.author].token

                        const answerComment: { body: AnswerComment } = await api
                          .post(`${apiURLs.answers}/comments`)
                          .set('Cookie', `token=${token}`)
                          .send({
                            ...R.omit([ 'author', 'mediaFiles' ], ac),
                            answerID: answer.body.answerID
                          })

                        await api
                          .put(`${apiURLs.answerComments}/${answerComment.body.answerCommentID}`)
                          .set('Cookie', `token=${adminToken}`)
                          .send({ isApproved: true })

                        if (ac.media) {
                          const uploadAPI = api
                            .post(`${apiURLs.answers}/${answer.body.answerID}/comments/${answerComment.body.answerCommentID}/upload`)
                            .set('Cookie', `token=${token}`)

                          ac.mediaFiles.map((m: number) => {
                            uploadAPI
                              .attach('answerCommentMedia', path.join(
                                __dirname, `images/answerComments/${m}.jpg`
                              ))
                          })
                          await uploadAPI
                        }
                      }))
                    }
                  }))
                }
              }))
            }
            return body
          }))
        }))
      }))
    })))

    const newList1: { body: List } = await api
      .post(apiURLs.lists)
      .set('Cookie', `token=${users[0].token}`)
      .send({ name: 'Wishlist' })

    await api
      .post(
        `${apiURLs.lists}/${newList1.body.listID}/products/${products[0].productID}`
      )
      .set('Cookie', `token=${users[0].token}`)

    await api
      .post(
        `${apiURLs.lists}/${newList1.body.listID}/products/${products[1].productID}`
      )
      .set('Cookie', `token=${users[0].token}`)

    const newList2: { body: List } = await api
      .post(apiURLs.lists)
      .set('Cookie', `token=${users[2].token}`)
      .send({ name: 'Stuff to buy' })

    await api
      .post(
        `${apiURLs.lists}/${newList2.body.listID}/products/${products[2].productID}`
      )
      .set('Cookie', `token=${users[2].token}`)

    const shippingMethods: { body: ShippingMethod[] } = await api
      .get(apiURLs.shippingMethods)

    const paymentMethods: { body: PaymentMethod[] } = await api
      .get(apiURLs.paymentMethods)

    const orderStatuses: { body: OrderStatus[] } = await api
      .get(apiURLs.orderStatuses)
      .set('Cookie', `token=${adminToken}`)

    const orderStatusDone = orderStatuses.body.find((os) => os.name === 'DONE')?.orderStatusID

    const invoiceStatuses: { body: InvoiceStatus[] } = await api
      .get(apiURLs.invoiceStatuses)
      .set('Cookie', `token=${adminToken}`)

    const invoiceStatusDone = invoiceStatuses.body.find((os) => os.name === 'DONE')?.invoiceStatusID

    const cartProduct1: { body: CartProduct } = await api
      .post(`${apiURLs.users}/${users[0].userID}/cartProducts`)
      .set('Cookie', `token=${users[0].token}`)
      .send({
        qty: 1,
        userID: users[0].userID,
        productID: products[1].productID
      })

    const order1: { body: Order & Invoice } = await api
      .post(apiURLs.orders)
      .set('Cookie', `token=${users[0].token}`)
      .send({
        address: users[0].address,
        details: 'Card 4242 4242 4242 4242',
        shippingMethodID: shippingMethods.body.find((sm) => sm.name === 'DOOR')?.shippingMethodID,
        paymentMethodID: paymentMethods.body.find((sm) => sm.name === 'CARD')?.paymentMethodID,
        userID: users[0].userID,
        cart: [ cartProduct1.body ]
      })

    await api
      .put(`${apiURLs.orders}/${order1.body.orderID}`)
      .set('Cookie', `token=${adminToken}`)
      .send({ orderStatusID: orderStatusDone })

    await api
      .put(`${apiURLs.invoices}/${order1.body.invoiceID}`)
      .set('Cookie', `token=${adminToken}`)
      .send({ invoiceStatusID: invoiceStatusDone })

    const cartProduct2: { body: CartProduct } = await api
      .post(`${apiURLs.users}/${users[2].userID}/cartProducts`)
      .set('Cookie', `token=${users[2].token}`)
      .send({
        qty: 1,
        userID: users[2].userID,
        productID: products[0].productID
      })

    const order2: { body: Order & Invoice } = await api
      .post(apiURLs.orders)
      .set('Cookie', `token=${users[2].token}`)
      .send({
        address: users[2].address,
        details: '',
        shippingMethodID: shippingMethods.body.find((sm) => sm.name === 'LOCKER')?.shippingMethodID,
        paymentMethodID: paymentMethods.body.find((sm) => sm.name === 'CASH')?.paymentMethodID,
        userID: users[2].userID,
        cart: [ cartProduct2.body ]
      })

    await api
      .put(`${apiURLs.orders}/${order2.body.orderID}`)
      .set('Cookie', `token=${adminToken}`)
      .send({ orderStatusID: orderStatusDone })

    await api
      .put(`${apiURLs.invoices}/${order2.body.invoiceID}`)
      .set('Cookie', `token=${adminToken}`)
      .send({ invoiceStatusID: invoiceStatusDone })
  } catch (error) { console.error(error) }
}

seed().then(async () => await db.destroy())
