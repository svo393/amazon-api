export interface ObjIndexed { [ k: string ]: any }

//
// Types from schema in order of creation
//

export type Role = { roleName: string}

export type ShippingMethod = { shippingMethodName: string; isPrivate: boolean}

export type AddressType = { addressTypeName: string; isPrivate: boolean}

export type PaymentMethod = { paymentMethodName: string}

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

export type Follower = { userID: number; follows: number}

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

export type Vendor = { vendorID: number; name: string}

export type Group = { groupID: number}

export type Product = {
  productID: number;
  title: string;
  listPrice?: number;
  price: number;
  bullets: string;
  description?: string;
  stock: number | null;
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

export type ListProduct = { listID: number; productID: number}

export type Rating = {
  ratingID: number;
  createdAt: Date;
  updatedAt: Date;
  title?: string;
  review: string;
  stars: number;
  likes: number;
  dislikes: number;
  isVerified: boolean;
  moderationStatus: string;
  userID: number;
  groupID: number;
  userEmail?: string;
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

export type GroupVariation = {
  name: string;
  value: string;
  groupID: number;
  productID: number;
}

export type Parameter = { parameterID: number; name: string}

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

export type OrderStatus = { orderStatusName: string}

export type ModerationStatus = { moderationStatusName: string}

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

export type InvoiceStatus = { invoiceStatusName: string}

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

export type ProductSize = { name: string; qty: number; productID: number }

//
// Derivative types
//

export type UserSignupInput = Pick<User, 'email' | 'password'>

export type UserLoginInput = UserSignupInput & { remember: boolean}

export type UserUpdateInput = {
  name?: string;
  info?: string;
  email?: string;
  password?: string;
  avatar?: boolean;
  role?: string;
}

export type PasswordRequestInput = Pick<User, 'email'>

export type PasswordResetInput = { password: string; resetToken: string}

export type CategoryCreateInput = Pick<Category, 'name' | 'parentCategoryID'>

export type CategoryUpdateInput = { name?: string; parentCategoryID?: number}

export type VendorInput = Pick<Vendor, 'name'>

export type ListCreateInput = Pick<List, 'name'>

export type ListFetchInput = Pick<List, 'userID'>

export type UserSafeData = Omit<User,
  | 'password'
  | 'resetToken'
  | 'resetTokenCreatedAt'
>

export type AddressTypeInput = { addressTypeName: string; isPrivate?: boolean}

export type ShippingMethodInput = { shippingMethodName: string; isPrivate?: boolean}

export type AddressCreateInput = Pick<Address, 'addr' | 'addressType'> & {
  isDefault?: boolean;
}

export type AddressFetchInput = { userID?: number; addressType?: string}

export type AddressUpdateInput = { name?: string; addressType?: string}

export type FollowerFetchInput = { userID?: number; follows?: number}

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
  | 'stock'
> & {
  stock?: number;
  productSizes?: { name: string; qty: number }[];
  productParameters?: { value: string; parameterID: number }[];
  groupID?: number;
  groupVariations?: { name: string; value: string }[];
}

export type ProductUpdateInput = ProductCreateInput &
{ groupID: number }

export type ProductData = Product & {
  group: GroupVariation[];
  productSize: ProductSize[];
}

export type ProductPublicData = Omit<ProductData,
  | 'createdAt'
  | 'updatedAt'
  | 'userID'
>

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

export type QuestionCreateInput = Pick<Question, | 'content' | 'groupID'>

export type QuestionUpdateInput = { content?: string; moderationStatus?: string}

export type AnswerCreateInput = Pick<Answer, | 'content' | 'questionID'>

export type AnswerUpdateInput = { content?: string; moderationStatus?: string}

export type AnswerCommentCreateInput = Pick<AnswerComment,
  | 'content'
  | 'answerID'
  | 'parentAnswerCommentID'
>

export type AnswerCommentUpdateInput = { content?: string; moderationStatus?: string}

export type GroupVariationCreateInput = { name: string; value: string}

export type GroupVariationUpdateInput = Pick<GroupVariation, | 'value'>

export type GroupVariationDeleteInput = Pick<GroupVariation, | 'name'>

export type ParameterInput = Pick<Parameter, 'name'>

export type ProductParametersInput = Pick<ProductParameter, 'value' | 'parameterID'>[]

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

export type VendorsFiltersInput = { q?: string}

export type CategoriesFiltersInput = { q?: string}

export type FeedFiltersInput = {
  q?: string;
  types?: string;
  moderationStatuses?: string;
  createdFrom?: string;
  createdTo?: string;
  userEmail?: string;
}

export type RatingsFiltersInput = {
  q?: string;
  groupID?: number;
  userEmail?: string;
  moderationStatuses?: string;
  isVerified?: boolean;
  createdFrom?: string;
  createdTo?: string;
  starsMin?: number;
  starsMax?: number;
  likesMin?: number;
  likesMax?: number;
  dislikesMin?: number;
  dislikesMax?: number;
}

export type ImagesFiltersInput = {
  productID?: number;
  ratingID?: number;
  ratingCommentID?: number;
  questionID?: number;
  answerID?: number;
  answerCommentID?: number;
  userID?: number;
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

export type ProductsMinFiltersInput = { title?: string }

export type UsersFiltersInput = {
  roles?: string;
  createdFrom?: string;
  createdTo?: string;
  page?: number;
  sortBy: string;
  orderCountMin?: number;
  orderCountMax?: number;
  ratingCountMin?: number;
  ratingCountMax?: number;
  activityCountMin?: number;
  activityCountMax?: number;
  email?: string;
}

export type OrderProductFullData = Pick<Product,
  | 'title'
> & Pick<OrderProduct,
  | 'productID'
  | 'orderID'
  | 'price'
  | 'qty'
> & { imageID: number }

export type OrderFullData = Order & { orderProducts: OrderProductFullData[]}

export type ImagesUpdateInput = { imageID: number; index: number}[]

export type ImagesDeleteInput = { imageID: number}[]
