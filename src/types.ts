import { GroupItem, Item, ItemParameter, Question, Rating } from '@prisma/client'

export type ItemAllData = Item & {
  questions: Question[];
  ratings: Rating[];
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

export type PasswordResetInput = {
  password: string;
  resetToken: string;
}

export type UserLoginInput = {
  email: string;
  password: string;
  remember: boolean;
}
