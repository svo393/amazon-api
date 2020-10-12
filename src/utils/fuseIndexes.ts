import Fuse from 'fuse.js'

export default (data: any[], keys: string[], query: string) =>
  (new Fuse(data, {
    threshold: 0.15,
    minMatchCharLength: 3,
    keys,
    ignoreLocation: true
  })).search(query).map((m) => m.refIndex)
