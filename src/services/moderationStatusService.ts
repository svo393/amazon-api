import { Request } from 'express'
import { ModerationStatus } from '../types'
import { db } from '../utils/db'
import StatusError from '../utils/StatusError'

const addModerationStatus = async (moderationStatusInput: ModerationStatus): Promise<ModerationStatus> => {
  const { rows: [ addedModerationStatus ] }: { rows: ModerationStatus[] } = await db.raw(
    `
    ? ON CONFLICT
      DO NOTHING
      RETURNING *;
    `,
    [ db('moderationStatuses').insert(moderationStatusInput) ]
  )

  if (typeof (addedModerationStatus) === 'undefined') {
    throw new StatusError(409, `ModerationStatus with name "${moderationStatusInput.moderationStatusName}" already exists`)
  }
  return addedModerationStatus
}

const getModerationStatuses = async (): Promise<ModerationStatus[]> => {
  return await db('moderationStatuses')
}

const updateModerationStatus = async (moderationStatusInput: ModerationStatus, req: Request): Promise<ModerationStatus> => {
  const [ updatedModerationStatus ]: ModerationStatus[] = await db('moderationStatuses')
    .update(moderationStatusInput, [ '*' ])
    .where('moderationStatusName', req.params.moderationStatusName)

  if (typeof (updatedModerationStatus) === 'undefined') throw new StatusError(404, 'Not Found')
  return updatedModerationStatus
}

const deleteModerationStatus = async (req: Request): Promise<void> => {
  const deleteCount = await db('moderationStatuses')
    .del()
    .where('moderationStatusName', req.params.moderationStatusName)

  if (deleteCount === 0) throw new StatusError(404, 'Not Found')
}

export default {
  addModerationStatus,
  getModerationStatuses,
  updateModerationStatus,
  deleteModerationStatus
}
