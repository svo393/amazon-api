import { Request } from 'express'
import { GroupVariant, GroupVariantInput } from '../types'
import { db } from '../utils/db'
import StatusError from '../utils/StatusError'

const addGroupVariant = async (groupVariantInput: GroupVariantInput, req: Request): Promise<GroupVariant> => {
  const { rows: [ addedGroupVariant ] }: { rows: GroupVariant[] } = await db.raw(
    `
    ? ON CONFLICT
      DO NOTHING
      RETURNING *;
    `,
    [ db('groupVariants').insert({
      ...groupVariantInput,
      productID: Number(req.params.productID),
      groupID: Number(req.params.groupID)
    }) ]
  )

  if (!addedGroupVariant) {
    throw new StatusError(409, 'This product is already added to the group')
  }
  return addedGroupVariant
}

const updateGroupVariant = async (groupVariantInput: GroupVariantInput, req: Request): Promise<GroupVariant> => {
  const [ updatedGroupVariant ]: GroupVariant[] = await db('groupVariants')
    .update(groupVariantInput, [ '*' ])
    .where('groupID', req.params.groupID)
    .andWhere('productID', req.params.productID)

  if (!updatedGroupVariant) throw new StatusError(404, 'Not Found')
  return updatedGroupVariant
}

export default {
  addGroupVariant,
  updateGroupVariant
}
