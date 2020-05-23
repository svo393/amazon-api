import { GroupItem, Item, ItemParameter, Question as Question1, Rating as Rating1 } from '@prisma/client'

export type ItemAllData = Item & {
  questions: Question1[];
  ratings: Rating1[];
  groupItems: GroupItem[];
  itemParameters: ItemParameter[];
}

export type ItemPublicData = Omit<ItemAllData,
  | 'createdAt'
  | 'updatedAt'
  | 'userID'
>

export type ItemListData = Pick<Item,
    | 'id'
    | 'name'
    | 'listPrice'
    | 'price'
    | 'stars'
    | 'primaryMedia'
    | 'ratingCount'
  >;

export type ItemCreateInputRaw = Omit<Item,
  | 'createdAt'
  | 'updatedAt'
  | 'stars'
  | 'id'
  | 'brandSectionID'
  | 'ratingCount'
> & {
  brandSection: string;
  itemParameters: {
    name: string;
    value: string;
  }[];
  groups: {
    name: string;
    itemID?: string;
    value: string;
  }[];
}

export type Role = {
  roleID: number;
  name: string;
}

export type ShippingMethod = {
  shippindMethodID: number;
  name: string;
}

export type Address = {
  addressID: number;
  name: string;
}

export type User = {
  userID: number;
  name?: string;
  info?: string;
  email: string;
  password: string;
  avatar: boolean;
  createdAt: Date;
  resetToken?: string;
  resetTokenExpiry?: string;
  isDeleted: boolean;
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

export type BrandSection = {
  brandSectionID: number;
  content: string;
}

export type Product = {
  productID: number;
  title: string;
  listPrice: number;
  price: number;
  description: string;
  stock: number;
  media: number;
  primaryMedia: number;
  createdAt: Date;
  updatedAt: Date;
  isAvailable: boolean;
  userID: number;
  categoryID: number;
  vendorID: number;
  brandSectionID: number;
}

export type Rating = {
  ratingID: number;
  createdAt: Date;
  updatedAt: Date;
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
  createdAt: Date;
  updatedAt: Date;
  content: string;
  media?: number;
  isVerified: boolean;
  userID: number;
  ratingID: number;
  parentRatingCommentID?: number;
}

export type Question = {
  questionID: number;
  createdAt: Date;
  updatedAt: Date;
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
  createdAt: Date;
  updatedAt: Date;
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
  createdAt: Date;
  updatedAt: Date;
  content: string;
  media?: number;
  isVerified: boolean;
  userID: number;
  answerID: number;
  parentAnswerCommentID?: number;
}

export type PasswordResetInput = {
  password: string;
  resetToken: string;
}

export type ListProduct = {
  listID: number;
  productID: number;
}

export type Group = {
  groupID: number;
  name: string;
}

export type GroupProduct = {
  name: string;
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
  createdAt: Date;
  updatedAt: Date;
  userID: number;
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
  createdAt: Date;
  orderID: number;
  invoiceStatusID: number;
}

export type OrderProduct = {
  price: number;
  qty: number;
  orderID: number;
  productID: number;
}

export type UserSignupInput = {
  email: string;
  password: string;
}

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
