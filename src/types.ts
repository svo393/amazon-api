export interface ObjIndexed { [key: string]: any }

//
// Types from schema in order of creation
//

export type Role = {
  roleName: string;
}

export type ShippingMethod = {
  shippingMethodName: string;
  isPrivate: boolean;
}

export type AddressType = {
  addressTypeName: string;
  isPrivate: boolean;
}

export type PaymentMethod = {
  paymentMethodName: string;
}

export type Address = {
  addressID: number;
  addr: string;
  addressType: string;
}

export type User = {
  userID: number;
  name?: string;
  info?: string;
  email: string;
  password: string;
  avatar: boolean;
  createdAt: Date;
  resetToken?: string | null;
  resetTokenCreatedAt?: Date | null;
  role: string;
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
  createdAt: Date;
  updatedAt: Date;
  isAvailable: boolean;
  userID: number;
  categoryID: number;
  vendorID: number;
  groupID: number;
}

export type Image = {
  imageID: number;
  index: number;
  productID?: number;
  ratingID?: number;
  ratingCommentID?: number;
  questionID?: number;
  answerID?: number;
  answerCommentID?: number;
  userID: number;
}

export type ListProduct = {
  listID: number;
  productID: number;
}

export type Rating = {
  ratingID: number;
  createdAt: Date;
  updatedAt: Date;
  title?: string;
  review?: string;
  stars: number;
  likes: number;
  dislikes: number;
  isVerified: boolean;
  moderationStatus: string;
  userID: number;
  groupID: number;
  userEmail: string;
}

export type RatingComment = {
  ratingCommentID: number;
  createdAt: Date;
  updatedAt: Date;
  content: string;
  moderationStatus: string;
  userID: number;
  ratingID: number;
  parentRatingCommentID?: number;
  userEmail: string;
}

export type Question = {
  questionID: number;
  createdAt: Date;
  updatedAt: Date;
  content: string;
  likes: number;
  dislikes: number;
  moderationStatus: string;
  userID: number;
  groupID: number;
  userEmail: string;
}

export type Answer = {
  answerID: number;
  createdAt: Date;
  updatedAt: Date;
  content: string;
  likes: number;
  dislikes: number;
  moderationStatus: string;
  userID: number;
  questionID: number;
  userEmail: string;
}

export type AnswerComment = {
  answerCommentID: number;
  createdAt: Date;
  updatedAt: Date;
  content: string;
  moderationStatus: string;
  userID: number;
  answerID: number;
  parentAnswerCommentID?: number;
  userEmail: string;
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
  orderStatusName: string;
}

export type ModerationStatus = {
  moderationStatusName: string;
}

export type Order = {
  orderID: number;
  address: string;
  userEmail: string | null;
  createdAt: Date;
  updatedAt: Date;
  userID: number | null;
  orderStatus: string;
  shippingMethod: string;
  amount: number;
  invoiceID: number;
}

export type OrderProduct = {
  price: number;
  qty: number;
  orderID: number;
  productID: number;
}

export type InvoiceStatus = {
  invoiceStatusName: string;
}

export type Invoice = {
  invoiceID: number;
  amount: number;
  details: string;
  createdAt: Date;
  updatedAt: Date;
  userEmail: string | null;
  orderID: number;
  userID: number | null;
  invoiceStatus: string;
  paymentMethod: string;
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
  info?: string;
  email?: string;
  password?: string;
  avatar?: boolean;
  role?: string;
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

export type AddressTypeInput = {
  addressTypeName: string;
  isPrivate?: boolean;
}

export type ShippingMethodInput = {
  shippingMethodName: string;
  isPrivate?: boolean;
}

export type AddressCreateInput = Pick<Address, 'addr' | 'addressType'> & {
  isDefault?: boolean;
}

export type AddressFetchInput = {
  userID?: number;
  addressType?: string;
}

export type AddressUpdateInput = {
  name?: string;
  addressType?: string;
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
  | 'createdAt'
  | 'updatedAt'
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
  isAvailable?: boolean;
  categoryID?: number;
  vendorID?: number;
}

export type ProductPublicData = Omit<Product,
  | 'createdAt'
  | 'updatedAt'
  | 'userID'
>

export type FormattedParameters = { [parameterID: number]: Parameter & ProductParameter }

export type RatingCreateInput = Pick<Rating,
  | 'title'
  | 'review'
  | 'stars'
  | 'groupID'
>

export type RatingUpdateInput = Pick<Rating,
  | 'title'
  | 'review'
> & {
  stars?: number;
  isVerified?: boolean;
  moderationStatus?: string;
}

export type RatingCommentCreateInput = Pick<RatingComment,
  | 'content'
  | 'ratingID'
  | 'parentRatingCommentID'
>

export type RatingCommentUpdateInput = {
  content?: string;
  moderationStatus?: string;
}

export type QuestionCreateInput = Pick<Question,
  | 'content'
  | 'groupID'
>

export type QuestionUpdateInput = {
  content?: string;
  moderationStatus?: string;
}

export type AnswerCreateInput = Pick<Answer,
  | 'content'
  | 'questionID'
>

export type AnswerUpdateInput = {
  content?: string;
  moderationStatus?: string;
}

export type AnswerCommentCreateInput = Pick<AnswerComment,
  | 'content'
  | 'answerID'
  | 'parentAnswerCommentID'
>

export type AnswerCommentUpdateInput = {
  content?: string;
  moderationStatus?: string;
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

export type OrderCreateInput = Pick<Order,
  | 'address'
  | 'userID'
  | 'shippingMethod'
> & {
  details: string;
  paymentMethod: string;
  cart: CartProduct[];
}

export type OrderUpdateInput = {
  address?: string;
  orderStatus?: string;
  shippingMethod?: string;
}

export type OrdersFiltersInput = {
  amountMin?: number;
  amountMax?: number;
  createdFrom?: string;
  createdTo?: string;
  orderStatuses?: string;
  shippingMethods?: string;
  userEmail?: string;
}

export type OrderProductCreateInput = Omit<OrderProduct, | 'orderID'>

export type OrderProductUpdateInput = Omit<OrderProductCreateInput, | 'productID'>

export type InvoiceCreateInput = Pick<Invoice,
  | 'amount'
  | 'details'
  | 'orderID'
  | 'paymentMethod'
  | 'userID'
>

export type InvoiceUpdateInput = {
  amount?: number;
  details?: string;
  paymentMethod?: string;
  invoiceStatus?: string;
}

export type InvoicesFiltersInput = {
  amountMin?: number;
  amountMax?: number;
  createdFrom?: string;
  createdTo?: string;
  invoiceStatuses?: string;
  paymentMethods?: string;
  userEmail?: string;
}

export type VendorsFiltersInput = {
  name?: string;
}

export type CategoriesFiltersInput = {
  name?: string;
}

export type FeedFiltersInput = {
  types?: string;
  moderationStatuses?: string;
  createdFrom?: string;
  createdTo?: string;
  content?: string;
  userEmail?: string;
}

export type ProductsFiltersInput = {
  groupID?: number;
  title?: string;
  priceMin?: number;
  priceMax?: number;
  categoryName?: string;
  vendorName?: string;
  stockMin?: number;
  stockMax?: number;
  isAvailable?: boolean;
  starsMin?: number;
  starsMax?: number;
  ratingMin?: number;
  ratingMax?: number;
}

export type UsersFiltersInput = {
  roles?: string;
  createdFrom?: string;
  createdTo?: string;
  orderCountMin?: number;
  orderCountMax?: number;
  ratingCountMin?: number;
  ratingCountMax?: number;
  activitiesCountMin?: number;
  activitiesCountMax?: number;
  email?: string;
}

export type OrderProductFullData = Pick<Product,
  | 'title'
> & Pick<OrderProduct,
  | 'productID'
  | 'orderID'
  | 'price'
  | 'qty'
>

export type OrderFullData = Order & {
  orderProducts: OrderProductFullData[];
}

export type ImagesUpdateInput = {
  imageID: number;
  index: number;
}[]

export type ImagesDeleteInput = {
  imageID: number;
}[]
