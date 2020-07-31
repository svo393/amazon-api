import { ObjIndexed } from '../types'

const sortItems = <T>(items: T[], sort: string) => {
  const compareValues = ([ key, order ]: string[]) =>
    (a: ObjIndexed, b: ObjIndexed) => {
      if (!(key in a) || !(key in b)) return 0
      const comparison = a[key] > b[key] ? 1 : -1
      return order === 'desc' ? comparison * -1 : comparison
    }

  return [ ...items ].sort(compareValues(sort.split('_')))
}

export default sortItems
