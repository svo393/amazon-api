import fs from 'fs'
import Knex from 'knex'
import { Image, ImagesFiltersInput, ImagesDeleteInput, ImagesUpdateInput } from '../types'
import { imagesBasePath } from '../utils/constants'
import { dbTrans, db } from '../utils/db'
import StatusError from '../utils/StatusError'

const getImages = async (imagesFiltersinput: ImagesFiltersInput): Promise<Image[]> => {
  const {
    productID,
    ratingID,
    ratingCommentID,
    questionID,
    answerID,
    answerCommentID
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

  return images
}

const updateImages = async (images: ImagesUpdateInput): Promise<Image> => {
  return dbTrans(async (trx: Knex.Transaction) => {
    await Promise.all(images.map(async (i) => {
      const [ updatedImage ]: Image[] = await trx('images')
        .update({ index: i.index }, [ '*' ])
        .where('imageID', i.imageID)

      if (updatedImage === undefined) throw new StatusError(404, 'Not Found')
      return updatedImage
    }))
  })
}

const deleteImages = async (images: ImagesDeleteInput): Promise<void> => {
  await dbTrans(async (trx: Knex.Transaction) => {
    await Promise.all(images.map(async (i) => {
      const deleteCount = await trx('images')
        .del()
        .where('imageID', i.imageID)

      if (deleteCount === 0) throw new StatusError(404, 'Not Found')

      // TODO try async rather than sync
      const dir = `${imagesBasePath}/images`
      const files = fs.readdirSync(dir)

      files.forEach((f) =>
        f.includes(i.imageID.toString()) && fs.unlinkSync(`${dir}/${f}`)
      )
    }))
  })
}

export default {
  getImages,
  updateImages,
  deleteImages
}
