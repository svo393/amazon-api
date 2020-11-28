import { equals } from 'ramda'
import { ObjIndexed } from '../types'

const sortItems = <T>(items: T[], sort: string): T[] => {
  const compareValues = ([_key, _order]: string[]) => (
    a: ObjIndexed,
    b: ObjIndexed
  ) => {
    let key = _key
    let order = _order
    if (!(key in a) || !(key in b)) return 0

    if (equals(a[key], b[key])) {
      key = 'createdAt'
      order = 'desc'
    }

    const comparison = a[key] > b[key] ? 1 : -1
    return order === 'desc' ? comparison * -1 : comparison
  }

  return [...items].sort(compareValues(sort.split('_')))
}

export default sortItems
