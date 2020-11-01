import { Request } from 'express'
import fs from 'fs'
import Knex from 'knex'
import { Image, ImagesDeleteInput, ImagesFiltersInput, ImagesUpdateInput, Product, Review } from '../types'
import { imagesBasePath } from '../utils/constants'
import { db, dbTrans } from '../utils/db'
import StatusError from '../utils/StatusError'

const getImages = async (imagesFiltersinput: ImagesFiltersInput): Promise<Image[]> => {
  const {
    productID,
    reviewID,
    userID
  } = imagesFiltersinput

  return await db<Image>('images')
    .where('productID', productID ?? 0)
    .orWhere('reviewID', reviewID ?? 0)
    .orWhere('userID', userID ?? 0)
}

const getImagesByGroup = async (req: Request): Promise<Image[]> => {
  const products = await db<Product>('products')
    .select('productID')
    .where('groupID', req.params.groupID)

  return await db('images')
    .whereIn('productID', products.map((p) => p.productID))
}

const getReviewImages = async (req: Request): Promise<Image[]> => {
  const reviews = await db<Review>('reviews')
    .select('reviewID')
    .where('groupID', req.params.groupID)

  return await db<Image>('images')
    .whereIn('reviewID', reviews.map((p) => p.reviewID))
}

const updateImages = async (images: ImagesUpdateInput): Promise<Image[]> => {
  return dbTrans(async (trx: Knex.Transaction) => {
    return await Promise.all(images.map(async (i) => {
      await trx('images')
        .update({ index: Number((`${Date.now()}${i.imageID}`).slice(8)) })
        .where('imageID', i.imageID)

      const [ updatedImage ]: Image[] = await trx('images')
        .update({ index: i.index }, [ '*' ])
        .where('imageID', i.imageID)

      if (updatedImage === undefined) throw new StatusError(404, 'Not Found')
      return updatedImage
    }))
  })
}

const deleteImages = async (images: ImagesDeleteInput): Promise<void> => {
  const imageIDs = images.map((i) => i.imageID)

  await dbTrans(async (trx: Knex.Transaction) => {
    const deleteCount = await trx('images')
      .del()
      .whereIn('imageID', imageIDs)

    if (deleteCount === 0) throw new StatusError(404, 'Not Found')

    const dir = `${imagesBasePath}/images`
    const files = fs.readdirSync(dir)

    const filesToDelete = new Set()

    files.forEach((f) =>
      imageIDs.forEach((id) =>
        f.includes(id.toString()) && filesToDelete.add(f)
      ))

    filesToDelete.forEach((f) => fs.unlinkSync(`${dir}/${f}`))
  })
}

export default {
  getImages,
  getImagesByGroup,
  getReviewImages,
  updateImages,
  deleteImages
}
