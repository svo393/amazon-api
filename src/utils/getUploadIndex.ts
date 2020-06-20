import StatusError from './StatusError'

export default (filename: string): number => {
  const match = /(?<=_)\d+(?=\.)/.exec(filename)
  if (!match) throw new StatusError(400, 'Invalid image filename')
  return Number(match[0])
}
