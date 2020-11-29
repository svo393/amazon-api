import Router from 'express'
import imageService from '../services/imageService'
import {
  checkImageFilters,
  checkImagesDelete,
  checkImagesUpdate
} from '../utils/typeGuard'

const router = Router()

router.get('/', async (req, res) => {
  const imagesFiltersInput = checkImageFilters(req)
  const images = await imageService.getImages(imagesFiltersInput)
  res.json(images)
})

router.put('/batch', async (req, res) => {
  const imagesUpdateInput = checkImagesUpdate(req)
  const updatedImages = await imageService.updateImages(
    imagesUpdateInput
  )
  res.json(updatedImages)
})

router.delete('/batch', async (req, res) => {
  const imagesDeleteInput = checkImagesDelete(req)
  await imageService.deleteImages(imagesDeleteInput)
  res.status(204).end()
})

export default router
