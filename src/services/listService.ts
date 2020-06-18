import { Request, Response } from 'express'
import { List, ListCreateInput } from '../types'
import { db } from '../utils/db'
import StatusError from '../utils/StatusError'

const addList = async (listInput: ListCreateInput, res: Response): Promise<List> => {
  const { rows: [ addedList ] }: { rows: List[] } = await db.raw(
    `
    ? ON CONFLICT
      DO NOTHING
      RETURNING *;
    `,
    [ db('lists').insert({ ...listInput, userID: res.locals.userID }) ]
  )

  if (typeof (addedList) === 'undefined') {
    throw new StatusError(409, `List with name "${listInput.name}" already exists`)
  }
  return addedList
}

const getListsByUser = async (req: Request): Promise<List[]> => {
  return await db('lists')
    .where('userID', req.params.userID)
}

const getListByID = async (req: Request): Promise<List> => {
  const list = await db<List>('lists')
    .first()
    .where('listID', req.params.listID)

  if (typeof (list) === 'undefined') throw new StatusError(404, 'Not Found')
  return list
}

const updateList = async (listInput: ListCreateInput, req: Request): Promise<List> => {
  const [ updatedList ]: List[] = await db('lists')
    .update(listInput, [ '*' ])
    .where('listID', req.params.listID)

  if (typeof (updatedList) === 'undefined') throw new StatusError(404, 'Not Found')
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
