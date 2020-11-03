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
  rels: `${baseAPI}/rels`,
  reviewComments: `${baseAPI}/review-comments`,
  reviews: `${baseAPI}/reviews`,
  roles: `${baseAPI}/roles`,
  search: `${baseAPI}/search`,
  shippingMethods: `${baseAPI}/shipping-methods`,
  users: `${baseAPI}/users`,
  vendors: `${baseAPI}/vendors`
}

export const defaultLimit = 10
export const smallLimit = 5

export const parametersBL = [
  'Item model number',
  'Product Dimensions',
  'Manufacturer',
  'Department',
  'Brand',
  'Brand Name',
  'Product model number',
  'Color',
  'Size'
]

export const sizeMap: { [ k: string ]: string } = {
  'xx-small': 'XXS',
  'x-small': 'XS',
  small: 'S',
  medium: 'M',
  large: 'L',
  'x-large': 'XL',
  'xx-large': '2XL',
  'xxx-large': '3XL',
  'xxxx-large': '4XL',
  'xxxxx-large': '5XL'
}

export const sizeList = [
  'XXS',
  'XS',
  'S',
  'M',
  'L',
  'XL',
  '2XL',
  '3XL',
  '4XL',
  '5XL'
]

export const colorList = [
  'black',
  'gray',
  'red',
  'orange',
  'yellow',
  'green',
  'teal',
  'blue',
  'indigo',
  'purple',
  'pink',
  'white'
]
