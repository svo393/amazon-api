import { Request } from 'express'
import Knex from 'knex'
import { omit } from 'ramda'
import { List, ListCreateInput, ListProduct, ListUpdateInput } from '../types'
import { db, dbTrans } from '../utils/db'
import StatusError from '../utils/StatusError'

const addList = async (listInput: ListCreateInput, req: Request): Promise<List> => {
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

    return addedList
  })
}

const getListsByUser = async (req: Request): Promise<List[]> => {
  return await db('lists')
    .where('userID', req.params.userID)
}

const getListByID = async (req: Request): Promise<List & { listProducts: number[] }> => {
  const { listID } = req.params

  const list = await db<List>('lists')
    .first()
    .where('listID', listID)

  const listProducts = await db<ListProduct>('listProducts as lp')
    .select(
      'lp.productID',
      'p.price',
      'i.imageID'
    )
    .where('lp.listID', listID)
    .where('i.index', 0)
    .leftJoin('products as p', 'lp.productID', 'p.productID')
    .leftJoin('images as i', 'lp.productID', 'i.productID')

  if (list === undefined) throw new StatusError(404, 'Not Found')
  return {
    ...list,
    listProducts: listProducts.map((lp) => ({
      ...lp,
      price: lp.price / 100
    }))
  }
}

const updateList = async (listInput: ListUpdateInput, req: Request): Promise<List> => {
  const [ updatedList ]: List[] = await db('lists')
    .update(listInput, [ '*' ])
    .where('listID', req.params.listID)

  if (updatedList === undefined) throw new StatusError(404, 'Not Found')
  return updatedList
}

const deleteList = async (req: Request): Promise<List> => {
  return await dbTrans(async (trx: Knex.Transaction) => {
    const list = await trx<List>('lists')
      .first()
      .where('listID', req.params.listID)

    const deleteCount = await trx('lists')
      .del()
      .where('listID', req.params.listID)

    if (deleteCount === 0) throw new StatusError(404, 'Not Found')

    return list
  })
}

export default {
  addList,
  getListsByUser,
  getListByID,
  updateList,
  deleteList
}
