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

  let initialUserIndex = 0
  let users: any = []

  while (initialUserIndex < initialUsers.length) {
    const res = await api
      .post(apiURLs.auth)
      .send({ email: initialUsers[initialUserIndex].email, password: initialUsers[initialUserIndex].password, name: initialUsers[initialUserIndex].name })

    users.push({
      ...initialUsers[initialUserIndex],
      userID: res.body.userID,
      sessionID: res.header['set-cookie'][0].split('; ')[0].slice(10)
    })

    initialUserIndex += 1
  }

  let userIndex = 0

  while (userIndex < users.length) {
    const data = pick([ 'avatar', 'info', 'cover' ], users[userIndex])

    !isEmpty(data) && await api
      .put(`${apiURLs.auth}/${users[userIndex].userID}`)
      .set('Cookie', `sessionID=${users[userIndex].sessionID}`)
      .send(data)

    userIndex += 1
  }

  userIndex = 0

  while (userIndex < users.length) {
    const data = pick([ 'avatar', 'info', 'cover' ], users[userIndex])

    !isEmpty(data) && await api
      .put(`${apiURLs.auth}/${users[userIndex].userID}`)
      .set('Cookie', `sessionID=${users[userIndex].sessionID}`)
      .send(data)

    userIndex += 1
  }

  userIndex = 0

  while (userIndex < users.length) {
    users[userIndex].avatar && await api
      .post(`${apiURLs.users}/${users[userIndex].userID}/upload-avatar`)
      .set('Cookie', `sessionID=${users[userIndex].sessionID}`)
      .attach('userAvatar', path.join(
        __dirname, `images/users/${userIndex}/avatar.jpg`
      ))

    users[userIndex].cover && await api
      .post(`${apiURLs.users}/${users[userIndex].userID}/upload-cover`)
      .set('Cookie', `sessionID=${users[userIndex].sessionID}`)
      .attach('userCover', path.join(
        __dirname, `images/users/${userIndex}/cover.jpg`
      ))

    userIndex += 1
  }

  userIndex = 0

  while (userIndex < users.length) {
    users[userIndex].address !== undefined && await api
      .post(apiURLs.addresses)
      .set('Cookie', `sessionID=${users[userIndex].sessionID}`)
      .send({
        ...users[userIndex].address as ObjIndexed,
        addressType: 'SHIPPING'
      })

    userIndex += 1
  }

  const allProductParameterNames = new Set<string>()

  Object.values(initialProducts)
    .forEach((c) => Object.values(c)
      .forEach((v) => (v as any[])
        .forEach((g) => (g.products as any[])
          .forEach((p) => (p.productParameters as any[] ?? [])
            .forEach((pp) => allProductParameterNames.add(pp.name))))))

  let parameterNamesIndex = 0
  let parameters: any = []

  while (parameterNamesIndex < allProductParameterNames.size) {
    const { addedParameter } = await createOneParameter('admin', Array.from(allProductParameterNames)[parameterNamesIndex], adminSessionID)
    parameters.push([ addedParameter.name, addedParameter.parameterID ])

    parameterNamesIndex += 1
  }

  const initialProductsArr = Object.entries(initialProducts)
  let initialProductIndex = 0

  while (initialProductIndex < initialProductsArr.length) {
    const [ catName, vendors ] = initialProductsArr[initialProductIndex]
    const { sessionID, userID } = await loginAs('admin')
    const { addedCategory } = await createOneCategory('admin', catName)

    const vendorsArr = Object.entries(vendors)
    let vendorIndex = 0

    while (vendorIndex < vendorsArr.length) {
      const [ vendorName, groups ] = vendorsArr[vendorIndex]
      const { addedVendor } = await createOneVendor('admin', vendorName)

      let groupIndex = 0

      while (groupIndex < groups.length) {
        const { questions, products } = groups[groupIndex]
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
              const parameter: any = parameters.find((par: any) => par[0] === pp.name)
              return { parameterID: parameter[1], value: pp.value }
            })
          })

        const groupID = body.groupID

        if (questions !== undefined) {
          let questionIndex = 0

          while (questionIndex < questions.length) {
            const sessionID = users[questions[questionIndex].author].sessionID

            const { body }: { body: Question } = await api
              .post(`${apiURLs.groups}/${groupID}/questions`)
              .set('Cookie', `sessionID=${sessionID}`)
              .send({ content: questions[questionIndex].content })

            const { answers } = questions[questionIndex]

            if (answers !== undefined) {
              let answerIndex = 0

              while (answerIndex < answers.length) {
                const sessionID = users[answers[answerIndex].author].sessionID

                await api
                  .post(`${apiURLs.questions}/${body.questionID}/answers`)
                  .set('Cookie', `sessionID=${sessionID}`)
                  .send({ content: answers[answerIndex].content })
                answerIndex += 1
              }
            }
            questionIndex += 1
          }
        }

        let productIndex = 0

        while (productIndex < products.length) {
          if (productIndex > 0) {
            const result: { body: Product } = await api
              .post(apiURLs.products)
              .set('Cookie', `sessionID=${sessionID}`)
              .send({
                ...omit([
                  'reviews',
                  'media',
                  'productParameters'
                ], products[productIndex]),
                userID,
                categoryID: addedCategory.categoryID,
                vendorID: addedVendor.vendorID,
                groupID,
                productParameters: products[productIndex].productParameters?.map((pp: any) => {
                  const parameter: any = parameters
                    .find((par: any) => par[0] === pp.name)
                  return { parameterID: parameter[1], value: pp.value }
                })
              })
            body = result.body
          }

          if (products[productIndex].media) {
            const uploadAPI = api
              .post(`${apiURLs.products}/${body.productID}/upload`)
              .set('Cookie', `sessionID=${sessionID}`)

            const mediaRange = [ ...Array(products[productIndex].media).keys() ]

            mediaRange.forEach((m) => {
              uploadAPI
                .attach('productImages', path.join(
                  __dirname, `images/products/${catName}/${vendorName}/${groupIndex}/${productIndex}/${m}.jpg`
                ))
            })
            await uploadAPI
          }

          const { reviews } = products[productIndex]

          if (reviews !== undefined) {
            let reviewIndex = 0

            while (reviewIndex < reviews.length) {
              if (reviews[reviewIndex] !== undefined) {
                const sessionID = users[reviews[reviewIndex].author].sessionID

                const { body: reviewBody }: { body: Review } = await api
                  .post(`${apiURLs.groups}/${groupID}/reviews`)
                  .set('Cookie', `sessionID=${sessionID}`)
                  .send({
                    ...omit([ 'author', 'comments' ], reviews[reviewIndex]),
                    productID: body.productID
                  })

                if (reviews[reviewIndex].media) {
                  const uploadAPI = api
                    .post(`${apiURLs.reviews}/${reviewBody.reviewID}/upload`)
                    .set('Cookie', `sessionID=${sessionID}`)

                  const mediaRange = [ ...Array(reviews[reviewIndex].media).keys() ]

                  mediaRange.forEach((m) => {
                    uploadAPI
                      .attach('reviewImages', path.join(
                        __dirname, `images/products/${catName}/${vendorName}/${groupIndex}/${productIndex}/reviews/${reviewIndex}/${m}.jpg`
                      ))
                  })
                  await uploadAPI
                }

                const { comments } = reviews[reviewIndex]

                if (comments !== undefined) {
                  const reviewComments: any = []
                  let reviewCommentIndex = 0

                  while (reviewCommentIndex < comments.length) {
                    const sessionID = users[comments[reviewCommentIndex].author].sessionID

                    const reviewComment: { body: ReviewComment } = await api
                      .post(`${apiURLs.reviews}/${reviewBody.reviewID}/comments`)
                      .set('Cookie', `sessionID=${sessionID}`)
                      .send({
                        ...omit([ 'author' ], comments[reviewCommentIndex]),
                        parentReviewCommentID: comments[reviewCommentIndex].replyTo !== undefined
                          ? reviewComments[comments[reviewCommentIndex].replyTo].reviewCommentID
                          : undefined
                      })

                    reviewComments.push(reviewComment.body)
                    reviewCommentIndex += 1
                  }
                }
              }
              reviewIndex += 1
            }
          }
          productIndex += 1
        }
        groupIndex += 1
      }
      vendorIndex += 1
    }
    initialProductIndex += 1
  }
}

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

seed()
  .then(async () => await db.destroy())
  .catch((error) => console.error(error))
