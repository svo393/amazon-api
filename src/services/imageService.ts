import fs from 'fs'
import Knex from 'knex'
import { Image, ImagesDeleteInput, ImagesFiltersInput, ImagesUpdateInput } from '../types'
import { imagesBasePath } from '../utils/constants'
import { db, dbTrans } from '../utils/db'
import StatusError from '../utils/StatusError'

const getImages = async (imagesFiltersinput: ImagesFiltersInput): Promise<Image[]> => {
  const {
    productID,
    ratingID,
    ratingCommentID,
    questionID,
    answerID,
    answerCommentID,
    userID
  } = imagesFiltersinput

  let images = await db<Image>('images')

  if (productID !== undefined) {
    images = images
      .filter((i) => i.productID === productID)
  }

  if (ratingID !== undefined) {
    images = images
      .filter((i) => i.ratingID === ratingID)
  }

  if (ratingCommentID !== undefined) {
    images = images
      .filter((i) => i.ratingCommentID === ratingCommentID)
  }

  if (questionID !== undefined) {
    images = images
      .filter((i) => i.questionID === questionID)
  }

  if (answerID !== undefined) {
    images = images
      .filter((i) => i.answerID === answerID)
  }

  if (answerCommentID !== undefined) {
    images = images
      .filter((i) => i.answerCommentID === answerCommentID)
  }

  if (userID !== undefined) {
    images = images
      .filter((i) => i.userID === userID)
  }

  return images
}

const updateImages = async (images: ImagesUpdateInput): Promise<Image> => {
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

    // TODO try async rather than sync
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
  updateImages,
  deleteImages
}
