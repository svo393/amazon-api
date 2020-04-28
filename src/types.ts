import { UserGetPayload } from '@prisma/client'

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
