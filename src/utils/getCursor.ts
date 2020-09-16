import StatusError from './StatusError'

type Props = {
  startCursor?: number;
  limit?: number;
  idProp?: string;
  idProps?: string[];
  data: any[];
}

export default ({
  startCursor,
  limit = 4,
  idProp,
  data
}: Props) => {
  const totalCount = data.length

  if (totalCount === 0) {
    return {
      totalCount: 0,
      hasNextPage: false,
      batch: []
    }
  }

  let start = 0

  if (startCursor !== undefined) {
    const index = data.findIndex((item) => item[idProp] === startCursor)
    if (index === -1) throw new StatusError(404, 'Not Found')
    start = index + 1
  }

  const batch = data.slice(start, start + limit)
  const endCursor = batch[batch.length - 1][idProp]
  const hasNextPage = start + limit < totalCount

  return {
    totalCount,
    endCursor,
    hasNextPage,
    batch
  }
}
