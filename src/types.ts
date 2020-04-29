import { Item, UserGetPayload } from '@prisma/client'

export type UserPersonalData = UserGetPayload<{
  select: {
    id: true;
    email: true;
    name: true;
    avatar: true;
    createdAt: true;
    role: true;
    cart: true;
  };
}>

export type UserPublicData = UserGetPayload<{
  select: {
    id: true;
    name: true;
    avatar: true;
  };
}>

export type AuthUserPersonalData = UserPersonalData & {
  token: string;
}

export type ItemPublicData = Omit<Item, 'createdAt' | 'updatedAt' | 'userID'>

export type ItemCreateInputRaw = {
  name: string;
  price: number;
  shortDescription: string;
  longDescription: string;
  stock: number;
  asin: string;
  media: number;
  primaryMedia: number;
  user: string;
  category: string;
  vendor: string;
}
