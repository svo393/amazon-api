import Fuse from 'fuse.js'
import { omit } from 'ramda'

export default (data: any[], keys: string[], query: string, idProp: string) =>
  (new Fuse(data, {
    minMatchCharLength: 3,
    includeMatches: true,
    keys
  })).search(query)
    .reduce((acc, cur) => {
      if (cur.matches === undefined) return {}

      acc[cur.item[idProp]] = Object.values(cur.matches)
        .map((i) => ({
          ...omit([ 'value' ], i)
        }))
      return acc
    }, {} as { [ k: string ]: { indices: readonly Fuse.RangeTuple[]; key?: string }[] })
