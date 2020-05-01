import { Item, Question, Rating } from '@prisma/client'

export type ItemAllData = Item & {
  questions: Question[];
  ratings: Rating[];
}

export type ItemPublicData = Omit<ItemAllData,
  | 'createdAt'
  | 'updatedAt'
  | 'userID'
>

export type ItemCreateInputRaw = Omit<Item,
  | 'createdAt'
  | 'updatedAt'
  | 'stars'
  | 'id'
  | 'userID'
  | 'categoryName'
  | 'vendorName'
> & {
  user: string;
  category: string;
  vendor: string;
}

export type PasswordResetInput = {
  password: string;
  resetToken: string;
}
