import Router from 'express'
import groupService from '../services/groupService'
import questionService from '../services/questionService'
import ratingService from '../services/ratingService'
import { checkGroupVariantUpdate, checkNewGroupVariant } from '../utils/inputValidator'
import { isAdmin } from '../utils/middleware'

const router = Router()

router.get('/:groupID/ratings', async (req, res) => {
  const ratings = await ratingService.getRatingsByGroup(req)
  res.json(ratings)
})

router.get('/:groupID/questions', async (req, res) => {
  const questions = await questionService.getQuestionsByGroup(req)
  res.json(questions)
})

router.post('/:groupID/product/:productID', isAdmin, async (req, res) => {
  const groupVariantCreateInput = checkNewGroupVariant(req)
  const addedGroupVariant = await groupService.addGroupVariant(groupVariantCreateInput, req)
  res.status(201).json(addedGroupVariant)
})

router.put('/:groupID/product/:productID/name/:name', isAdmin, async (req, res) => {
  const groupVariantUpdateInput = checkGroupVariantUpdate(req)
  const updatedGroupVariant = await groupService.updateGroupVariant(groupVariantUpdateInput, req)
  res.status(200).json(updatedGroupVariant)
})

export default router
