import { Request } from 'express'
import { FormattedGroups, Group, GroupCreateInput, GroupProduct, GroupProductInput, GroupUpdateInput } from '../types'
import { db } from '../utils/db'
import StatusError from '../utils/StatusError'

const addGroup = async (groupInput: GroupCreateInput): Promise<Group> => {
  return await db<Group>('groups')
    .insert(groupInput, [ '*' ])
}

const addGroupProduct = async (groupProductInput: GroupProductInput, req: Request): Promise<GroupProduct> => {
  const { rows: [ addedGroupProduct ] }: { rows: GroupProduct[] } = await db.raw(
    `? ON CONFLICT
       DO NOTHING
       RETURNING *;`,
    [ db('groupProducts').insert({
      ...groupProductInput,
      productID: Number(req.params.productID),
      groupID: Number(req.params.groupID)
    }) ]
  )

  if (!addedGroupProduct) {
    throw new StatusError(409, 'This product is already added to the group')
  }
  return addedGroupProduct
}

const getGroupsByProduct = async (req: Request): Promise<FormattedGroups[]> => {
  const groupIDs = await db('groupProducts as gp')
    .select('g.groupID')
    .leftJoin('groups as g', 'gp.groupID', 'g.groupID')
    .where('productID', req.params.productID)

  const groups = await db('groups as g')
    .leftJoin('groupProducts as gp', 'gp.groupID', 'g.groupID')
    .whereIn('g.groupID', groupIDs.map((id) => id.groupID))
    .orderBy('g.name')

  return groups.reduce((acc, cur) => {
    return acc[cur.groupID]
      ? { ...acc, [cur.groupID]: [ ...acc[cur.groupID], cur ] }
      : { ...acc, [cur.groupID]: [ cur ] }
  }, {})
}

const updateGroup = async (groupInput: GroupUpdateInput, req: Request): Promise<Group> => {
  const [ updatedGroup ]: Group[] = await db('groups')
    .update(groupInput, [ '*' ])
    .where('groupID', req.params.groupID)

  if (!updatedGroup) throw new StatusError(404, 'Not Found')
  return updatedGroup
}

export default {
  addGroup,
  addGroupProduct,
  getGroupsByProduct,
  updateGroup
}
