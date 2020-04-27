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

export interface AuthUserPersonalData extends UserPersonalData {
  token: string;
}
