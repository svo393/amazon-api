export const roles = [ 'ROOT', 'ADMIN', 'CUSTOMER' ]
export const shippingMethods = [ 'INTL', 'DOOR', 'LOCKER' ]
export const sensitiveShippingMethods = [ 'INTL', 'DOOR' ]
export const paymentMethods = [ 'CARD', 'CASH' ]
export const addressTypes = [ 'SHIPPING', 'LOCKER' ]
export const sensitiveAddressTypes = [ 'SHIPPING' ]
export const lockerAddresses = [
  'Pokrovka St, 17, Moscow, 101000 Russian Federation',
  'Altuf\'yevskoye Shosse, 70к1, Moscow, 127549 Russian Federation'
]
export const orderStatuses = [ 'DONE', 'PROCESSING', 'NEW', 'CANCELED' ]
export const invoiceStatuses = [ 'DONE', 'PROCESSING', 'NEW', 'CANCELED' ]
export const baseAPI = '/api'
export const apiURLs = {
  categories: `${baseAPI}/categories`,
  products: `${baseAPI}/products`,
  users: `${baseAPI}/users`,
  vendors: `${baseAPI}/vendors`,
  roles: `${baseAPI}/roles`,
  orderStatuses: `${baseAPI}/order-statuses`,
  invoiceStatuses: `${baseAPI}/invoice-statuses`,
  shippingMethods: `${baseAPI}/shipping-methods`,
  addressTypes: `${baseAPI}/address-types`,
  paymentMethods: `${baseAPI}/payment-methods`,
  addresses: `${baseAPI}/addresses`,
  userAddresses: `${baseAPI}/user-addresses`,
  lists: `${baseAPI}/lists`,
  ratings: `${baseAPI}/ratings`,
  ratingComments: `${baseAPI}/rating-comments`,
  questions: `${baseAPI}/questions`,
  answers: `${baseAPI}/answers`,
  answerComments: `${baseAPI}/answer-comments`,
  groups: `${baseAPI}/groups`,
  parameters: `${baseAPI}/parameters`,
  orders: `${baseAPI}/orders`
}
