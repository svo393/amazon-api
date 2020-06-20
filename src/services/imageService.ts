import fs from 'fs'
import Knex from 'knex'
import { Image, ImagesDeleteInput, ImagesUpdateInput } from '../types'
import { imagesBasePath } from '../utils/constants'
import { dbTrans } from '../utils/db'
import StatusError from '../utils/StatusError'

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
  updateImages,
  deleteImages
}
