import { User, Item, UserGetPayload } from '@prisma/client'

export type NewItem = Omit<Item, 'id'>

export type UserInput = Pick<User, 'email' | 'password'>

export type UserPersonalData = UserGetPayload<{
  select: {
    avatar: true;
    email: true;
    id: true;
    name: true;
    cart: true;
    role: true;
  };
}>

export type NonSensitiveUser = UserGetPayload<{
  select: {
    id: true;
    name: true;
    email: true;
    avatar: true;
    createdAt: true;
    role: true;
    cart: true;
  };
}>

export interface AuthUserPersonalData extends UserPersonalData {
  token: string;
}
