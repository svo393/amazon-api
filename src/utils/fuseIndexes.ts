import Fuse from 'fuse.js'

export default (data: any[], keys: string[], query: string) =>
  (new Fuse(data, {
    minMatchCharLength: 3,
    keys
  })).search(query).map((m) => m.refIndex)
