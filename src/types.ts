import { Item, Question, Rating } from '@prisma/client'

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

export type ItemPublicData = Omit<Item, 'createdAt' | 'updatedAt' | 'userID'>

export type ItemDataWithQuestionsAndRatings = Item & {
  questions: Question[];
  ratings: Rating[];
}

export type ItemPublicDataWithQuestionsAndRatings = Omit<ItemDataWithQuestionsAndRatings, 'createdAt' | 'updatedAt' | 'userID'>

export type CategoryCreateInputRaw = {
  name: string;
  parent?: string;
}

export type PasswordResetInput = {
  password: string;
  resetToken: string;
}
