import Fuse from 'fuse.js'

export default (data: any[], keys: string[], query: string) =>
// TODO play with options
  (new Fuse(data, {
    threshold: 0.2,
    ignoreLocation: true,
    keys
  })).search(query).map((m) => m.refIndex)
