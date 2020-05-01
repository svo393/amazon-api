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

export type PasswordResetInput = {
  password: string;
  resetToken: string;
}
