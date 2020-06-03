//
// Types from schema in order of creation
//

export type Role = {
  roleID: number;
  name: string;
}

export type ShippingMethod = {
  shippingMethodID: number;
  name: string;
}

export type AddressType = {
  addressTypeID: number;
  name: string;
}

export type PaymentMethod = {
  paymentMethodID: number;
  name: string;
}

export type Address = {
  addressID: number;
  addr: string;
  addressTypeID: number;
}

export type User = {
  userID: number;
  name?: string;
  info?: string;
  email: string;
  password: string;
  avatar: boolean;
  userCreatedAt: Date;
  resetToken?: string | null;
  resetTokenCreatedAt?: Date | null;
  roleID: number;
}

export type Follower = {
  userID: number;
  follows: number;
}

export type UserAddress = {
  isDefault: boolean;
  userID: number;
  addressID: number;
}

export type List = {
  listID: number;
  name: string;
  userID: number;
}

export type Category = {
  categoryID: number;
  name: string;
  parentCategoryID?: number;
}

export type Vendor = {
  vendorID: number;
  name: string;
}

export type Group = {
  groupID: number;
}

export type Product = {
  productID: number;
  title: string;
  listPrice: number;
  price: number;
  description: string;
  brandSection?: string;
  stock: number;
  media: number;
  primaryMedia: number;
  productCreatedAt: Date;
  productUpdatedAt: Date;
  isAvailable: boolean;
  userID: number;
  categoryID: number;
  vendorID: number;
  groupID: number;
}

export type ListProduct = {
  listID: number;
  productID: number;
}

export type Rating = {
  ratingID: number;
  ratingCreatedAt: Date;
  ratingUpdatedAt: Date;
  title?: string;
  review?: string;
  media?: number;
  stars: number;
  likes: number;
  dislikes: number;
  isVerified: boolean;
  userID: number;
  groupID: number;
}

export type RatingComment = {
  ratingCommentID: number;
  ratingCommentCreatedAt: Date;
  ratingCommentUpdatedAt: Date;
  content: string;
  media?: number;
  isVerified: boolean;
  userID: number;
  ratingID: number;
  parentRatingCommentID?: number;
}

export type Question = {
  questionID: number;
  questionCreatedAt: Date;
  questionUpdatedAt: Date;
  content: string;
  media?: number;
  likes: number;
  dislikes: number;
  isVerified: boolean;
  userID: number;
  groupID: number;
}

export type Answer = {
  answerID: number;
  answerCreatedAt: Date;
  answerUpdatedAt: Date;
  content: string;
  media?: number;
  likes: number;
  dislikes: number;
  isVerified: boolean;
  userID: number;
  questionID: number;
}

export type AnswerComment = {
  answerCommentID: number;
  answerCommentCreatedAt: Date;
  answerCommentUpdatedAt: Date;
  content: string;
  media?: number;
  isVerified: boolean;
  userID: number;
  answerID: number;
  parentAnswerCommentID?: number;
}

export type GroupVariant = {
  name: string;
  value: string;
  groupID: number;
  productID: number;
}

export type Parameter = {
  parameterID: number;
  name: string;
}

export type ProductParameter = {
  value: string;
  parameterID: number;
  productID: number;
}

export type CartProduct = {
  qty: number;
  userID: number;
  productID: number;
}

export type OrderStatus = {
  orderStatusID: number;
  name: string;
}

export type Order = {
  orderID: number;
  address: string;
  orderCreatedAt: Date;
  orderUpdatedAt: Date;
  userID: number | null;
  orderStatusID: number;
  shippingMethodID: number;
}

export type OrderProduct = {
  price: number;
  qty: number;
  orderID: number;
  productID: number;
}

export type InvoiceStatus = {
  invoiceStatusID: number;
  name: string;
}

export type Invoice = {
  invoiceID: number;
  amount: number;
  details: string;
  invoiceCreatedAt: Date;
  invoiceUpdatedAt: Date;
  orderID: number;
  userID: number;
  invoiceStatusID: number;
  paymentMethodID: number;
}

//
// Derivative types
//

export type UserSignupInput = Pick<User, 'email' | 'password'>

export type UserLoginInput = UserSignupInput & {
  remember: boolean;
}

export type UserUpdateInput = {
  name?: string;
  email?: string;
  password?: string;
  avatar?: boolean;
  roleID?: number;
}

export type PasswordRequestInput = Pick<User, 'email'>

export type PasswordResetInput = {
  password: string;
  resetToken: string;
}

export type CategoryCreateInput = Pick<Category, 'name' | 'parentCategoryID'>

export type CategoryUpdateInput = {
  name?: string;
  parentCategoryID?: number;
}

export type VendorInput = Pick<Vendor, 'name'>

export type ListCreateInput = Pick<List, 'name'>

export type ListFetchInput = Pick<List, 'userID'>

export type UserSafeData = Omit<User,
  | 'password'
  | 'resetToken'
  | 'resetTokenCreatedAt'
>

export type RoleInput = Pick<Role, 'name'>

export type ShippingMethodInput = Pick<ShippingMethod, 'name'>

export type AddressTypeInput = Pick<AddressType, 'name'>

export type AddressCreateInput = Pick<Address, 'addr' | 'addressTypeID'> & {
  isDefault?: boolean;
}

export type PaymentMethodInput = Pick<PaymentMethod, 'name'>

export type AddressFetchInput = {
  userID?: number;
  addressTypeID?: number;
}

export type AddressUpdateInput = {
  name?: string;
  addressTypeID?: number;
}

export type FollowerFetchInput = {
  userID?: number;
  follows?: number;
}

export type UserAddressCreateInput =
  Pick<UserAddress, 'userID' | 'addressID'> & {
  isDefault?: boolean;
}
export type UserAddressUpdateInput = Pick<UserAddress, 'isDefault'>

export type UserAddressFetchInput = Pick<UserAddress, 'userID'>

export type ProductCreateInput = Omit<Product,
  | 'productID'
  | 'productCreatedAt'
  | 'productUpdatedAt'
  | 'userID'
  | 'isAvailable'
> & {
  isAvailable?: boolean;
  parameters?: {
    name: string;
    value: string;
  }[];
  groupID?: number;
  variants?: {
    name: string;
    value: string;
  }[];
}

export type ProductUpdateInput = {
  title?: string;
  listPrice?: number;
  price?: number;
  description?: string;
  brandSection?: string;
  stock?: number;
  media?: number;
  primaryMedia?: number;
  isAvailable?: boolean;
  categoryID?: number;
  vendorID?: number;
}

export type ProductPublicData = Omit<Product,
  | 'productCreatedAt'
  | 'productUpdatedAt'
  | 'userID'
>

export type FormattedParameters = { [parameterID: number]: Parameter & ProductParameter }

export type ProductListData = Pick<Product,
  | 'productID'
  | 'title'
  | 'listPrice'
  | 'price'
  | 'primaryMedia'
> & {
  stars: number;
  ratingCount: number;
  group: GroupVariant[];
}

export type ProductAllData = Product & {
  stars: number;
  ratingCount: number;
  group: GroupVariant[];
}

export type RatingCreateInput = Pick<Rating,
  | 'title'
  | 'review'
  | 'media'
  | 'stars'
  | 'groupID'
>

export type RatingUpdateInput = Pick<Rating,
  | 'title'
  | 'review'
  | 'media'
> & {
  stars?: number;
  isVerified?: boolean;
  isApproved?: boolean;
}

export type RatingCommentCreateInput = Pick<RatingComment,
  | 'content'
  | 'media'
  | 'ratingID'
  | 'parentRatingCommentID'
>

export type RatingCommentUpdateInput = Pick<RatingComment,
  | 'media'
> & {
  content?: string;
  isApproved?: boolean;
}

export type QuestionCreateInput = Pick<Question,
  | 'content'
  | 'media'
  | 'groupID'
>

export type QuestionUpdateInput = Pick<Question,
  | 'media'
> & {
  content?: string;
  isApproved?: boolean;
}

export type AnswerCreateInput = Pick<Answer,
  | 'content'
  | 'media'
  | 'questionID'
>

export type AnswerUpdateInput = Pick<Answer,
  | 'media'
> & {
  content?: string;
  isApproved?: boolean;
}

export type AnswerCommentCreateInput = Pick<AnswerComment,
  | 'content'
  | 'media'
  | 'answerID'
  | 'parentAnswerCommentID'
>

export type AnswerCommentUpdateInput = Pick<AnswerComment,
  | 'media'
> & {
  content?: string;
  isApproved?: boolean;
}

export type GroupVariantCreateInput = {
  name: string;
  value: string;
}

export type GroupVariantUpdateInput = Pick<GroupVariant, | 'value'>

export type ParameterCreateInput = Pick<Parameter, 'name'>[]

export type ParameterUpdateInput = Pick<Parameter, 'name'>

export type ProductParameterInput = Pick<ProductParameter, 'value'>

export type CartProductInput = Pick<CartProduct, 'qty'>

export type OrderStatusInput = Pick<OrderStatus, 'name'>

export type InvoiceStatusInput = Pick<InvoiceStatus, 'name'>

export type OrderCreateInput = Pick<Order,
  | 'address'
  | 'userID'
  | 'shippingMethodID'
> & {
  details: string;
  paymentMethodID: number;
  cart: CartProduct[];
}

export type OrderUpdateInput = {
  address?: string;
  orderStatusID?: number;
  shippingMethodID?: number;
}

export type OrderProductCreateInput = Omit<OrderProduct, | 'orderID'>

export type OrderProductUpdateInput = Omit<OrderProductCreateInput, | 'productID'>

export type InvoiceCreateInput = Pick<Invoice,
  | 'amount'
  | 'details'
  | 'orderID'
  | 'paymentMethodID'
  | 'userID'
>

export type InvoiceUpdateInput = {
  amount?: number;
  details?: string;
  paymentMethodID?: number;
  invoiceStatusID?: number;
}
