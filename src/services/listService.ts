import { Response } from 'express'
import { List, ListCreateInput, ListFetchInput } from '../types'
import { db } from '../utils/db'
import StatusError from '../utils/StatusError'

const addList = async (listInput: ListCreateInput, res: Response): Promise<List> => {
  const { name } = listInput
  const { userID } = res.locals

  const existingList = await db<List>('lists')
    .first()
    .where('name', name)
    .andWhere('userID', userID)

  if (existingList) {
    throw new StatusError(409, `List with name "${name}" already exists`)
  }

  const [ addedList ]: List[] = await db('lists')
    .insert({ ...listInput, userID }, [ '*' ])

  return addedList
}

const getLists = async (listInput: ListFetchInput): Promise<List[]> => {
  const { userID } = listInput

  return await db('lists')
    .where('userID', userID)
}

const getListByID = async (listID: number): Promise<List> => {
  const list = await db<List>('lists')
    .first()
    .where('listID', listID)

  if (!list) throw new StatusError(404, 'Not Found')
  return list
}

const updateList = async (listInput: ListCreateInput, listID: number): Promise<List> => {
  const [ updatedList ]: List[] = await db<List>('lists')
    .update(listInput, [ '*' ])
    .where('listID', listID)

  if (!updatedList) throw new StatusError(404, 'Not Found')
  return updatedList
}

const deleteList = async (listID: number): Promise<void> => {
  const deleteCount = await db<List>('lists')
    .del()
    .where('listID', listID)

  if (deleteCount === 0) throw new StatusError(404, 'Not Found')
}

export default {
  addList,
  getLists,
  getListByID,
  updateList,
  deleteList
}
