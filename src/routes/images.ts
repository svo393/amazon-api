import Router from 'express'
import imageService from '../services/imageService'
import { isCreatorOrAdmin } from '../utils/middleware'
import { checkImageUpdate } from '../utils/inputValidator'

const router = Router()

router.put('/:imageID', isCreatorOrAdmin('images', 'imageID', 'params'), async (req, res) => {
  const imageUpdateInput = checkImageUpdate(req)
  const updatedImage = await imageService.updateImage(imageUpdateInput, req)
  res.json(updatedImage)
})

router.delete('/:imageID', isCreatorOrAdmin('images', 'imageID', 'params'), async (req, res) => {
  await imageService.deleteImage(req)
  res.status(204).end()
})

export default router
