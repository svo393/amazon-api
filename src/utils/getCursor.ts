import StatusError from './StatusError'

type Props = {
  startCursor?: number;
  limit?: number;
  idProp: string;
  data: { [ k: string ]: any }[];
}

export default ({ startCursor, limit = 0, idProp, data }: Props) => {
  const totalCount = data.length
  let start = 0

  if (startCursor !== undefined) {
    const index = data.findIndex((item) => item[idProp] === startCursor)
    if (index === -1) throw new StatusError(404, 'Not Found')
    start = index + 1
  }

  const batch = data.slice(start, start + limit)
  const endItem = batch[batch.length - 1]

  const endCursor = endItem !== undefined
    ? endItem[idProp]
    : null

  const hasNextPage = start + limit < totalCount

  return {
    totalCount,
    endCursor,
    hasNextPage,
    batch
  }
}
