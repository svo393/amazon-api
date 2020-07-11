import Router from 'express'
import moderationStatusService from '../services/moderationStatusService'
import { checkNewModerationStatus, checkModerationStatusUpdate } from '../utils/inputValidator'
import { isAdmin } from '../utils/middleware'

const router = Router()

router.post('/', isAdmin, async (req, res) => {
  const moderationStatusCreateInput = checkNewModerationStatus(req)
  const addedModerationStatus = await moderationStatusService.addModerationStatus(moderationStatusCreateInput)
  res.status(201).json(addedModerationStatus)
})

router.get('/', isAdmin, async (_, res) => {
  const moderationStatuses = await moderationStatusService.getModerationStatuses()
  res.json(moderationStatuses)
})

router.put('/:moderationStatusName', isAdmin, async (req, res) => {
  const moderationStatusUpdateInput = checkModerationStatusUpdate(req)
  const updatedModerationStatus = await moderationStatusService.updateModerationStatus(moderationStatusUpdateInput, req)
  res.json(updatedModerationStatus)
})

router.delete('/:moderationStatusName', isAdmin, async (req, res) => {
  await moderationStatusService.deleteModerationStatus(req)
  res.status(204).end()
})

export default router
