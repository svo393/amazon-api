import { Request } from 'express'
import Knex from 'knex'
import { omit } from 'ramda'
import { List, ListCreateInput, ListProduct } from '../types'
import { db, dbTrans } from '../utils/db'
import StatusError from '../utils/StatusError'

const addList = async (listInput: ListCreateInput, req: Request): Promise<List & { listProducts: number[] }> => {
  return await dbTrans(async (trx: Knex.Transaction) => {
    const { rows: [ addedList ] }: { rows: List[] } = await trx.raw(
    `
    ? ON CONFLICT
      DO NOTHING
      RETURNING *;
    `,
    [ trx('lists').insert({
      ...omit([ 'productID' ], listInput),
      userID: req.session?.userID
    }) ]
    )

    if (addedList === undefined) {
      throw new StatusError(409, `List with name "${listInput.name}" already exists`)
    }

    const { rows: [ addedLP ] }: { rows: ListProduct[] } = await trx.raw(
      `
      ? ON CONFLICT
        DO NOTHING
        RETURNING *;
      `,
      [ trx('listProducts').insert({
        listID: addedList.listID,
        productID: listInput.productID
      }) ]
    )

    if (addedLP === undefined) {
      throw new StatusError(409, 'This product is already added to the list')
    }

    return { ...addedList, listProducts: [ addedLP.productID ] }
  })
}

const getListsByUser = async (req: Request): Promise<List[]> => {
  return await db('lists')
    .where('userID', req.params.userID)
}

const getListByID = async (req: Request): Promise<List> => {
  const list = await db<List>('lists')
    .first()
    .where('listID', req.params.listID)

  if (list === undefined) throw new StatusError(404, 'Not Found')
  return list
}

const updateList = async (listInput: ListCreateInput, req: Request): Promise<List> => {
  const [ updatedList ]: List[] = await db('lists')
    .update(listInput, [ '*' ])
    .where('listID', req.params.listID)

  if (updatedList === undefined) throw new StatusError(404, 'Not Found')
  return updatedList
}

const deleteList = async (req: Request): Promise<void> => {
  const deleteCount = await db('lists')
    .del()
    .where('listID', req.params.listID)

  if (deleteCount === 0) throw new StatusError(404, 'Not Found')
}

export default {
  addList,
  getListsByUser,
  getListByID,
  updateList,
  deleteList
}
