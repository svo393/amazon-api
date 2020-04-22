type Item = {
  id: string;
  name: string;
  price: number;
  shortDescription: string;
  longDescription: string;
  stock: number;
  stars: number;
  asin: string;
  media: number;
  primaryMedia: number;
  createdAt: Date;
  updatedAt: Date;
  isAvailable: boolean;
  userID: string;
  categoryID: string;
  vendorID: string;
}

type NewItem = Omit<Item, 'id'>

type User = {
  id: string;
  name?: string | null;
  email: string;
  password: string;
  avatar: boolean;
  createdAt: Date;
  resetToken?: string | null;
  resetTokenExpiry?: string | null;
  role: Role;
}

enum Role {
  ROOT = 'ROOT',
  ADMIN = 'ADMIN',
  USER = 'USER'
}

export type NewUser = Pick<User, 'email' | 'password'>
