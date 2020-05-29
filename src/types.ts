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
  productID: number;
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
  productID: number;
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

export type Group = {
  groupID: number;
  name: string;
}

export type GroupProduct = {
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

export type InvoiceStatus = {
  invoiceStatusID: number;
  name: string;
}

export type Invoice = {
  invoiceID: number;
  amount: number;
  invoiceCreatedAt: Date;
  orderID: number;
  invoiceStatusID: number;
}

export type OrderProduct = {
  price: number;
  qty: number;
  orderID: number;
  productID: number;
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

export type ProductListData = Pick<Product,
| 'productID'
| 'title'
| 'listPrice'
| 'price'
| 'primaryMedia'
> & {
  stars: number;
  ratingCount: number;
  groups: (Group & GroupProduct)[];
}

export type ProductAllData = Product & {
  stars: number;
  ratingCount: number;
  groups: (Group & GroupProduct)[];
}

// export type ItemCreateInputRaw = Omit<Item,
//   | 'productCreatedAt'
//   | 'productUpdatedAt'
//   | 'stars'
//   | 'id'
//   | 'brandSectionID'
//   | 'ratingCount'
// > & {
//   brandSection: string;
//   itemParameters: {
//     name: string;
//     value: string;
//   }[];
//   groups: {
//     name: string;
//     itemID?: string;
//     value: string;
//   }[];
// }

export type RatingCreateInput = Pick<Rating,
  | 'title'
  | 'review'
  | 'media'
  | 'stars'
  | 'productID'
>

export type RatingUpdateInput = Pick<Rating,
  | 'title'
  | 'review'
  | 'media'
> & {
  stars?: number;
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
}

export type QuestionCreateInput = Pick<Question,
  | 'content'
  | 'media'
  | 'productID'
>

export type QuestionUpdateInput = Pick<Question,
  | 'media'
> & {
  content?: string;
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
}

export type GroupInput = Pick<Group, 'name'>

export type ParameterInput = Pick<Parameter, 'name'>
