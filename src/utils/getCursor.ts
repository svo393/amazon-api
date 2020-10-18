import StatusError from './StatusError'

type Props = {
  startCursor?: number;
  startCursorType?: string;
  limit?: number;
  idProp?: string;
  idTypes?: string[];
  data: any[];
}

const getCursor = ({ startCursor, startCursorType, limit = 4, idProp, idTypes, data }: Props) => {
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
    const index = idProp !== undefined
      ? data.findIndex((item) => item[idProp] === startCursor)
      : data.findIndex((item) => item[(startCursorType as string) + 'ID'] === startCursor)
    if (index === -1) throw new StatusError(404, 'Not Found')
    start = index + 1
  }

  let endCursor
  let endCursorType

  const batch = data.slice(start, start + limit)

  if (batch.length === 0) {
    return {
      totalCount: 0,
      hasNextPage: false,
      batch: []
    }
  }

  if (idProp !== undefined) {
    endCursor = batch[batch.length - 1][idProp]
  } else {
    for (const prop of idTypes as string[]) {
      const id = batch[batch.length - 1][prop + 'ID']

      if (id !== undefined) {
        endCursor = id
        endCursorType = prop
        break
      }
    }
  }

  const hasNextPage = start + limit < totalCount

  return {
    totalCount,
    endCursor,
    endCursorType,
    hasNextPage,
    batch
  }
}

export default getCursor
