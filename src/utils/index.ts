export const makeID = (length: number): string =>
  Math.random().toString(10).substring(2, length + 2)
