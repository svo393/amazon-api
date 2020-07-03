import { Request } from 'express'
import { GroupVariation, GroupVariationCreateInput, GroupVariationUpdateInput } from '../types'
import { db } from '../utils/db'
import StatusError from '../utils/StatusError'

const addGroupVariation = async (groupVariationInput: GroupVariationCreateInput, req: Request): Promise<GroupVariation> => {
  const { rows: [ addedGroupVariation ] }: { rows: GroupVariation[] } = await db.raw(
    `
    ? ON CONFLICT
      DO NOTHING
      RETURNING *;
    `,
    [ db('groupVariations').insert({
      ...groupVariationInput,
      productID: Number(req.params.productID),
      groupID: Number(req.params.groupID)
    }) ]
  )

  if (addedGroupVariation === undefined) {
    throw new StatusError(409, 'This product is already added to the group')
  }
  return addedGroupVariation
}

const getGroupVariationsByGroup = async (req: Request): Promise<GroupVariation[]> =>
  await db<GroupVariation>('groupVariations')
    .where('groupID', req.params.groupID)

const updateGroupVariation = async (groupVariationInput: GroupVariationUpdateInput, req: Request): Promise<GroupVariation> => {
  const [ updatedGroupVariation ]: GroupVariation[] = await db('groupVariations')
    .update(groupVariationInput, [ '*' ])
    .where('groupID', req.params.groupID)
    .andWhere('productID', req.params.productID)
    .andWhere('name', req.params.name)

  if (updatedGroupVariation === undefined) throw new StatusError(404, 'Not Found')
  return updatedGroupVariation
}

export default {
  addGroupVariation,
  getGroupVariationsByGroup,
  updateGroupVariation
}
