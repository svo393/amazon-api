import Router from 'express'
import groupService from '../services/groupService'
import questionService from '../services/questionService'
import { checkGroupVariationUpdate, checkNewGroupVariation, checkGroupVariationDeletion } from '../utils/inputValidator'
import { requireAdmin } from '../utils/middleware'
import imageService from '../services/imageService'

const router = Router()

router.get('/:groupID/questions', async (req, res) => {
  const questions = await questionService.getQuestionsByGroup(req)
  res.json(questions)
})

router.get('/:groupID/variations', async (req, res) => {
  const groupVariations = await groupService.getGroupVariationsByGroup(req)
  res.json(groupVariations)
})

router.get('/:groupID/images', async (req, res) => {
  const images = await imageService.getImagesByGroup(req)
  res.json(images)
})

router.post('/:groupID/product/:productID', requireAdmin, async (req, res) => {
  const groupVariationCreateInput = checkNewGroupVariation(req)
  const addedGroupVariation = await groupService.addGroupVariation(groupVariationCreateInput, req)
  res.status(201).json(addedGroupVariation)
})

router.put('/:groupID/product/:productID/name/:name', requireAdmin, async (req, res) => {
  const groupVariationUpdateInput = checkGroupVariationUpdate(req)
  const updatedGroupVariation = await groupService.updateGroupVariation(groupVariationUpdateInput, req)
  res.status(200).json(updatedGroupVariation)
})

router.delete('/:groupID/variations', requireAdmin, async (req, res) => {
  const groupVariationDeletionInput = checkGroupVariationDeletion(req)
  await groupService.deleteGroupVariation(groupVariationDeletionInput, req)
  res.status(204).end()
})

export default router
