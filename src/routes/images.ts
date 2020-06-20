import Router from 'express'
import imageService from '../services/imageService'
import { checkImagesDelete, checkImagesUpdate } from '../utils/inputValidator'

const router = Router()

router.put('/batch', async (req, res) => {
  const imagesUpdateInput = checkImagesUpdate(req)
  const updatedImages = await imageService.updateImages(imagesUpdateInput)
  res.json(updatedImages)
})

router.delete('/batch', async (req, res) => {
  const imagesDeleteInput = checkImagesDelete(req)
  await imageService.deleteImages(imagesDeleteInput)
  res.status(204).end()
})

export default router
