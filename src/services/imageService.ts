import { Request } from 'express'
import fs from 'fs'
import Knex from 'knex'
import { Image, ImageUpdateInput } from '../types'
import { imagesBasePath } from '../utils/constants'
import { db, dbTrans } from '../utils/db'
import StatusError from '../utils/StatusError'

const updateImage = async (imageInput: ImageUpdateInput, req: Request): Promise<Image> => {
  const [ updatedImage ]: Image[] = await db('images')
    .update({ index: imageInput.index }, [ '*' ])
    .where('imageID', req.params.imageID)

  if (updatedImage === undefined) throw new StatusError(404, 'Not Found')
  return updatedImage
}

const deleteImage = async (req: Request): Promise<void> => {
  const { imageID } = req.params

  await dbTrans(async (trx: Knex.Transaction) => {
    const deleteCount = await trx('images')
      .del()
      .where('imageID', imageID)

    if (deleteCount === 0) throw new StatusError(404, 'Not Found')

    // TODO try async rather than sync
    const dir = `${imagesBasePath}/images`
    const files = fs.readdirSync(dir)

    files.forEach((f) =>
      f.includes(imageID) && fs.unlinkSync(`${dir}/${f}`)
    )
  })
}

export default {
  updateImage,
  deleteImage
}
