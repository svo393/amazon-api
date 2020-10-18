import Fuse from 'fuse.js'

export interface ObjIndexed { [ k: string ]: any }

//
// Types from schema in order of creation
//

export type Role = { roleName: string }

export type ShippingMethod = { shippingMethodName: string; isPrivate: boolean }

export type AddressType = { addressTypeName: string; isPrivate: boolean }

export type PaymentMethod = { paymentMethodName: string }

export type Address = {
  addressID: number;
  country: string;
  fullName: string;
  streetAddressLine1: string;
  streetAddressLine2?: string;
  city: string;
  region: string;
  postalCode: number;
  phoneNumber: string;
  addressType: string;
}

export type AddressCreateInput = Omit<Address, 'addressID'> & { isDefault?: true }
export type AddressUpdateInput = Partial<AddressCreateInput>

export type User = {
  userID: number;
  name: string;
  info?: string | null;
  email: string;
  password: string;
  avatar: boolean;
  cover: boolean;
  createdAt: Date;
  resetToken?: string | null;
  resetTokenCreatedAt?: Date | null;
  role: string;
}

export type Follower = { userID: number; follows: number }

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

export type Vendor = { vendorID: number; name: string }

export type Group = { groupID: number }

export type Product = {
  productID: number;
  title: string;
  listPrice: number | null;
  price: number;
  bullets: string;
  description: string | null;
  stock: number | null;
  createdAt: Date;
  updatedAt: Date;
  isAvailable: boolean;
  userID?: number;
  categoryID: number;
  vendorID: number;
  groupID: number;
}

export type Image = {
  imageID: number;
  index: number;
  productID?: number;
  reviewID?: number;
  userID: number;
}

export type Vote = {
  voteID: number;
  vote: boolean;
  reviewID?: number;
  questionID?: number;
  answerID?: number;
  userID: number;
}

export type ListProduct = { listID: number; productID: number }

export type Review = {
  reviewID: number;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  content: string;
  stars: number;
  isVerified: boolean;
  moderationStatus: string;
  userID: number;
  groupID: number;
  productID: number;
}

export type ReviewComment = {
  reviewCommentID: number;
  createdAt: Date;
  updatedAt: Date;
  content: string;
  moderationStatus: string;
  userID: number;
  reviewID: number;
  parentReviewCommentID?: number;
}

export type Question = {
  questionID: number;
  createdAt: Date;
  updatedAt: Date;
  content: string;
  moderationStatus: string;
  userID: number;
  groupID: number;
}

export type Answer = {
  answerID: number;
  createdAt: Date;
  updatedAt: Date;
  content: string;
  moderationStatus: string;
  userID: number;
  questionID: number;
}

export type GroupVariation = {
  name: string;
  value: string;
  groupID: number;
  productID: number;
}

export type Parameter = { parameterID: number; name: string }

export type ProductParameter = {
  value: string;
  parameterID: number;
  productID: number;
}

export type CartProduct = {
  qty: number;
  size: string;
  userID: number;
  productID: number;
}

export type OrderStatus = { orderStatusName: string }

export type ModerationStatus = { moderationStatusName: string }

export type Order = {
  orderID: number;
  address: Address;
  createdAt: Date;
  updatedAt: Date;
  shippedAt: Date | null;
  userID: number;
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
  size: string;
}

export type InvoiceStatus = { invoiceStatusName: string }

export type Invoice = {
  invoiceID: number;
  amount: number;
  details: string;
  createdAt: Date;
  updatedAt: Date;
  orderID: number;
  userID: number | null;
  invoiceStatus: string;
  paymentMethod: string;
  shippingCost: number;
}

export type ProductSize = { name: string; qty: number; productID: number }

//
// Derivative types
//

export type Matches = {
  indices: readonly Fuse.RangeTuple[];
  key?: string | undefined;
}[]

export type ReviewWithUser = Review & {
  images: Image[];
  votes: number;
  author: Pick<User, 'name' | 'userID' | 'avatar'> & { email?: string };
  reviewCommentCount: string | number;
}

type Activity = (
  ReviewComment |
  Question |
  Answer
) & { type: string; userEmail: string }

export type Feed = Activity[]
export type UserFeed = ((
  ReviewComment |
  Review |
  Answer
) & { type: string })[]

export type QuestionWithUser = Question & {
  votes: number;
  author?: Pick<User, 'name' | 'userID' | 'avatar' | 'email'>;
}

export type AnswerWithUser = Answer & {
  votes: number;
  author: Pick<User, 'name' | 'userID' | 'avatar'> & { email?: string };
}

export type ReviewCommentWithUser = ReviewComment & {
  hasChildren: boolean;
  author: Pick<User, 'name' | 'userID' | 'avatar'> & { email?: string };
}

export type UserSignupInput = Pick<User, 'email' | 'password' | 'name'>

export type UserLoginInput = Pick<User, 'email' | 'password'> & { remember?: boolean }

export type UserRoleUpdateInput = { role: string }

export type UserUpdateInput = Partial<Pick<User,
  | 'name'
  | 'email'
  | 'avatar'
  | 'cover'
>> & { info?: string | null }

export type UserPasswordUpdateInput = { curPassword: string; newPassword: string }

export type PasswordRequestInput = Pick<User, 'email'>

export type PasswordResetInput = { newPassword: string; resetToken: string }

export type CategoryCreateInput = Pick<Category, 'name' | 'parentCategoryID'>

export type CategoryUpdateInput = Partial<CategoryCreateInput>

export type VendorInput = Pick<Vendor, 'name'>

export type ListCreateInput = Pick<List, 'name'> & { productID: number }
export type ListUpdateInput = Pick<List, 'name'>

export type ListFetchInput = Pick<List, 'userID'>

export type UserSafeData = Omit<User,
  | 'password'
  | 'resetToken'
  | 'resetTokenCreatedAt'
>

export type AddressTypeInput = { addressTypeName: string; isPrivate?: boolean }

export type ShippingMethodInput = { shippingMethodName: string; isPrivate?: boolean }

export type AddressFetchInput = { userID?: number; addressType?: string }

export type FollowerFetchInput = { userID?: number; follows?: number }

export type UserAddressCreateInput = Partial<Pick<UserAddress, 'isDefault'>>
export type UserAddressUpdateInput = Pick<UserAddress, 'isDefault'>

export type UserAddressFetchInput = Pick<UserAddress, 'userID'>

export type ProductCreateInput = Omit<Product,
  | 'productID'
  | 'createdAt'
  | 'updatedAt'
  | 'userID'
  | 'stock'
  | 'listPrice'
> & {
  listPrice?: number;
  stock?: number;
  productSizes?: { name: string; qty: number }[];
  productParameters?: { value: string; parameterID: number }[];
  groupID?: number;
  groupVariations?: { name: string; value: string }[];
}

export type ProductUpdateInput = Omit<ProductCreateInput, 'listPrice'> & { groupID: number; listPrice?: number; }

export type ProductData = Product & {
  group: GroupVariation[];
  productSize: ProductSize[];
}

export type ProductPublicData = Omit<ProductData,
  | 'createdAt'
  | 'updatedAt'
  | 'userID'
>

export type ReviewCreateInput = Pick<Review,
  | 'title'
  | 'content'
  | 'productID'
  | 'stars'
> & Partial<Pick<Review, 'isVerified'>>

export type ReviewUpdateInput = Partial<Pick<Review,
  | 'title'
  | 'content'
  | 'stars'
  | 'isVerified'
  | 'moderationStatus'
>>

export type ReviewCommentCreateInput = Pick<ReviewComment,
  | 'content'
  | 'parentReviewCommentID'
>

export type ReviewCommentUpdateInput = Partial<Pick<ReviewComment,
  | 'content'
  | 'moderationStatus'
>>

export type QuestionCreateInput = Pick<Question, | 'content'>

export type QuestionUpdateInput = Partial<Pick<Question,
  | 'content'
  | 'moderationStatus'
>>

export type AnswerCreateInput = Pick<Answer, 'content'>

export type AnswerUpdateInput = Partial<Pick<Answer,
  | 'content'
  | 'moderationStatus'
>>

export type CursorInput = {
  startCursor?: number;
  limit?: number;
  page?: number;
  sortBy?: string;
}

export type QuestionCursorInput = CursorInput & {
  answerLimit?: number;
  onlyAnswered?: boolean;
 }

export type BatchWithCursor<T> = {
  totalCount: number;
  endCursor?: number;
  endCursorType?: string;
  hasNextPage: boolean;
  batch: T[];
}

export type GroupVariationCreateInput = { name: string; value: string }

export type GroupVariationUpdateInput = Pick<GroupVariation, | 'value'>

export type GroupVariationDeleteInput = Pick<GroupVariation, | 'name'>

export type ParameterInput = Pick<Parameter, 'name'>

export type ProductParametersInput = Pick<ProductParameter, 'value' | 'parameterID'>[]

export type CartProductInput = Pick<CartProduct, 'qty' | 'size'>
export type CartProductDeleteInput = Pick<CartProduct, 'size'>

export type LocalCart = (Omit<CartProduct, 'userID'> & { toMerge: boolean })[]

export type OrderCreateInput = Pick<Order,
  | 'shippingMethod'
> & {
  addressID: number;
  details: string;
  paymentMethod: string;
  promo?: string;
  shippingCost: number;
}

export type OrderUpdateInput = Partial<Pick<Order,
| 'orderStatus'
| 'shippingMethod'
> & { addressID: number }>

export type OrdersFiltersInput = {
  amountMin?: number;
  amountMax?: number;
  page?: number;
  sortBy?: string;
  createdFrom?: string;
  createdTo?: string;
  orderStatuses?: string;
  shippingMethods?: string;
  userEmail?: string;
  userID?: number;
  startCursor?: number;
}

export type OrderProductInput = Omit<OrderProduct, | 'orderID' | 'productID'>

export type InvoiceCreateInput = Pick<Invoice,
  | 'amount'
  | 'details'
  | 'orderID'
  | 'userID'
  | 'paymentMethod'
>

export type InvoiceUpdateInput = Partial<Pick<Invoice,
| 'amount'
| 'details'
| 'invoiceStatus'
| 'paymentMethod'
>>

export type InvoicesFiltersInput = {
  amountMin?: number;
  amountMax?: number;
  page?: number;
  sortBy?: string;
  createdFrom?: string;
  createdTo?: string;
  invoiceStatuses?: string;
  paymentMethods?: string;
  userEmail?: string;
}

export type VendorsFiltersInput = {
  q?: string;
  page?: number;
  sortBy?: string;
}

export type CategoriesFiltersInput = {
  q?: string;
  page?: number;
  sortBy?: string;
}

export type UserFeedFiltersInput = {
  startCursor?: number;
  startCursorType?: string;
  types?: string;
}

export type FeedFiltersInput = {
  q?: string;
  types?: string;
  groupID?: number;
  page?: number;
  sortBy?: string;
  moderationStatuses?: string;
  createdFrom?: string;
  createdTo?: string;
  userEmail?: string;
}

export type AskFiltersInput = { q: string }
export type SearchFiltersInput = {
  q?: string;
  page?: number;
  sortBy?: string;
  outOfStock?: boolean;
  categoryID?: number;
  vendorIDs?: number[];
  colors?: string[];
  sizes?: string[];
  priceMin?: number;
  priceMax?: number;
  starsMin?: number;
 }

export type ReviewsFiltersInput = {
  q?: string;
  limit?: number;
  groupID?: number;
  userEmail?: string;
  page?: number;
  sortBy?: string;
  moderationStatuses?: string;
  isVerified?: boolean;
  createdFrom?: string;
  productID?: number;
  createdTo?: string;
  starsMin?: number;
  starsMax?: number;
  votesMin?: number;
  votesMax?: number;
}

export type ImagesFiltersInput = {
  productID?: number;
  reviewID?: number;
  userID?: number;
}

export type VotesCreateInput = { vote: boolean }

export type VotesFiltersInput = {
  reviewID?: number;
  questionID?: number;
  answerID?: number;
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
  reviewCountPerProduct?: boolean;
  starsMin?: number;
  starsMax?: number;
  reviewMin?: number;
  reviewMax?: number;
  page?: number;
  sortBy?: string;
}

export type ProductsMinFiltersInput = { title?: string }
export type HistoryInput = { items: number[] }

export type UsersFiltersInput = {
  roles?: string;
  createdFrom?: string;
  createdTo?: string;
  page?: number;
  sortBy?: string;
  orderCountMin?: number;
  orderCountMax?: number;
  reviewCountMin?: number;
  reviewCountMax?: number;
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
  | 'size'
> & { imageID: number }

export type OrderFullData = Order & { orderProducts: OrderProductFullData[]}
export type OrderWithUser = OrderFullData & {
  user: Pick<User, 'name' | 'userID' | 'avatar'> & { email?: string };
}

export type ImagesUpdateInput = { imageID: number; index: number }[]

export type ImagesDeleteInput = { imageID: number }[]
