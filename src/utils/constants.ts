export const roles = [ 'ROOT', 'ADMIN', 'CUSTOMER' ]
export const paymentMethods = [ 'CARD', 'CASH' ]
export const shippingMethods = [
  { shippingMethodName: 'INTL', isPrivate: true },
  { shippingMethodName: 'DOOR', isPrivate: true },
  { shippingMethodName: 'LOCKER' }
]
export const addressTypes = [
  { addressTypeName: 'SHIPPING', isPrivate: true },
  { addressTypeName: 'LOCKER' }
]

export const moderationStatuses = [ 'NEW', 'APPROVED', 'REJECTED' ]
export const orderStatuses = [ 'DONE', 'SHIPPED', 'NEW', 'CANCELED' ]
export const invoiceStatuses = [ 'DONE', 'NEW', 'CANCELED' ]

export const imagesBasePath = './public/media'

export const baseAPI = '/api'
export const apiURLs = {
  addresses: `${baseAPI}/addresses`,
  addressTypes: `${baseAPI}/address-types`,
  answers: `${baseAPI}/answers`,
  auth: `${baseAPI}/auth`,
  categories: `${baseAPI}/categories`,
  feed: `${baseAPI}/feed`,
  groups: `${baseAPI}/groups`,
  images: `${baseAPI}/images`,
  invoices: `${baseAPI}/invoices`,
  invoiceStatuses: `${baseAPI}/invoice-statuses`,
  lists: `${baseAPI}/lists`,
  moderationStatuses: `${baseAPI}/moderation-statuses`,
  orders: `${baseAPI}/orders`,
  orderStatuses: `${baseAPI}/order-statuses`,
  parameters: `${baseAPI}/parameters`,
  paymentMethods: `${baseAPI}/payment-methods`,
  products: `${baseAPI}/products`,
  questions: `${baseAPI}/questions`,
  reviewComments: `${baseAPI}/review-comments`,
  reviews: `${baseAPI}/reviews`,
  roles: `${baseAPI}/roles`,
  search: `${baseAPI}/search`,
  shippingMethods: `${baseAPI}/shipping-methods`,
  users: `${baseAPI}/users`,
  vendors: `${baseAPI}/vendors`
}

export const defaultLimit = 15
export const smallLimit = 5
