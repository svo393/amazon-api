import { Request } from 'express'
import { db } from '../utils/db'
import { ProductListData, Group, GroupInput } from '../types'
import { getProductsQuery } from '../utils/queries'
import StatusError from '../utils/StatusError'

const addGroup = async (groupInput: GroupInput): Promise<Group> => {
  const { name } = groupInput

  const existingGroup = await db<Group>('groups')
    .first('groupID')
    .where('name', name)

  if (existingGroup) {
    throw new StatusError(409, `Group with name "${name}" already exists`)
  }

  const [ addedGroup ]: Group[] = await db<Group>('groups')
    .insert(groupInput, [ '*' ])

  return addedGroup
}

const getGroups = async (): Promise<Group[]> => {
  return await db<Group>('groups')
}

type SingleGroupData = {
  name: string;
  products: ProductListData[];
}

const getGroupByID = async (req: Request): Promise<SingleGroupData> => {
  const groups = await db<Group>('groups')
  const [ group ] = groups.filter((c) => c.groupID === Number(req.params.groupID))
  if (!group) throw new StatusError(404, 'Not Found')

  const products: ProductListData[] = await getProductsQuery.clone()
    .where('groupID', req.params.groupID)

  return { ...group, products }
}

const updateGroup = async (groupInput: GroupInput, req: Request): Promise<SingleGroupData> => {
  const [ updatedGroup ] = await db<Group>('groups')
    .update({ ...groupInput }, [ 'groupID' ])
    .where('groupID', req.params.groupID)

  if (!updatedGroup) throw new StatusError(404, 'Not Found')
  return getGroupByID(req)
}

export default {
  addGroup,
  getGroups,
  getGroupByID,
  updateGroup
}
