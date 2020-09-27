import { Express } from 'express'
import fs from 'fs'
import path from 'path'
import sharp from 'sharp'
import logger from './logger'

type UploadConfig = {
  fileNames: number[];
  imagesPath: string;
  maxWidth: number;
  maxHeight: number;
  previewWidth?: number;
  previewHeight?: number;
  thumbWidth?: number;
  thumbHeight?: number;
  addWebp?: boolean;
}

export const uploadImages = async (files: Express.Multer.File[], {
  fileNames,
  imagesPath,
  maxWidth,
  maxHeight,
  previewWidth,
  previewHeight,
  thumbWidth,
  thumbHeight,
  addWebp = false
}: UploadConfig): Promise<void> => {
  await Promise.all(files.map(async (file, index) => {
    const image = sharp(file.path)
    const info = await image.metadata()
    const fileName = fileNames[index]

    if ((info.width as number) > maxWidth || (info.height as number) > maxHeight) {
      await image
        .resize(maxWidth, maxHeight, { fit: 'inside' })
        .jpeg({ progressive: true })
        .toFile(
          path.resolve(imagesPath, `${fileName}_${maxWidth}.jpg`)
        )

      addWebp && await image
        .resize(maxWidth, maxHeight, { fit: 'inside' })
        .webp()
        .toFile(
          path.resolve(imagesPath, `${fileName}_${maxWidth}.webp`)
        )
    } else {
      await image
        .jpeg({ progressive: true })
        .toFile(
          path.resolve(imagesPath, `${fileName}_${maxWidth}.jpg`)
        )

      addWebp && await image
        .webp()
        .toFile(
          path.resolve(imagesPath, `${fileName}_${maxWidth}.webp`)
        )
    }

    if (previewWidth !== undefined && previewHeight !== undefined) {
      await image
        .resize(previewWidth, previewHeight, { fit: 'inside' })
        .jpeg({ progressive: true })
        .toFile(
          path.resolve(imagesPath, `${fileName}_${previewWidth}.jpg`)
        )

      addWebp && await image
        .resize(previewWidth, previewHeight, { fit: 'inside' })
        .webp()
        .toFile(
          path.resolve(imagesPath, `${fileName}_${previewWidth}.webp`)
        )
    }

    if (thumbWidth !== undefined && thumbHeight !== undefined) {
      await image
        .resize(thumbWidth, thumbHeight, { fit: 'inside' })
        .jpeg({ progressive: true })
        .toFile(
          path.resolve(imagesPath, `${fileName}_${thumbWidth}.jpg`)
        )

      addWebp && await image
        .resize(thumbWidth, thumbHeight, { fit: 'inside' })
        .webp()
        .toFile(
          path.resolve(imagesPath, `${fileName}_${thumbWidth}.webp`)
        )
    }
  }))

  files.map((file) => { fs.unlink(file.path, (err) => err && logger.error(err)) })
}
