const toNewItem = (object: any): object => object
const toUpdatedItem = (body: object, cookies: object): object => body
const toDeletedItem = (id: string, cookies: object): string => id

export default {
  toNewItem,
  toUpdatedItem,
  toDeletedItem
}
