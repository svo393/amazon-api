import { Request } from 'express'
import fs from 'fs'
import path from 'path'
import sharp from 'sharp'

type UploadConfig = {
  imagePath: string;
  maxWidth: number;
  maxHeight: number;
  previewWidth?: number;
  previewHeight?: number;
  thumbWidth: number;
  thumbHeight: number;
}

export const uploadImages = (files: Express.Multer.File[], req: Request, uploadConfig: UploadConfig, entityID: string): void => {
  const {
    imagePath,
    maxWidth,
    maxHeight,
    previewWidth,
    previewHeight,
    thumbWidth,
    thumbHeight
  } = uploadConfig

  files.map(async (file, index) => {
    const image = sharp(file.path)
    const info = await image.metadata()
    const fileName = `${req.params[entityID]}_${index}`

    if ((info.width as number) > maxWidth || (info.height as number) > maxHeight) {
      await image
        .resize(maxWidth, maxHeight, { fit: 'inside' })
        .jpeg({ progressive: true })
        .toFile(
          path.resolve(imagePath, `${fileName}_${maxWidth}.jpg`)
        )

      await image
        .resize(maxWidth, maxHeight, { fit: 'inside' })
        .webp()
        .toFile(
          path.resolve(imagePath, `${fileName}_${maxWidth}.webp`)
        )
    } else {
      await image
        .jpeg({ progressive: true })
        .toFile(
          path.resolve(imagePath, `${fileName}_${maxWidth}.jpg`)
        )

      await image
        .webp()
        .toFile(
          path.resolve(imagePath, `${fileName}_${maxWidth}.webp`)
        )
    }

    if (previewWidth && previewHeight) {
      await image
        .resize(previewWidth, previewHeight, { fit: 'inside' })
        .jpeg({ progressive: true })
        .toFile(
          path.resolve(imagePath, `${fileName}_${previewWidth}.jpg`)
        )

      await image
        .resize(previewWidth, previewHeight, { fit: 'inside' })
        .webp()
        .toFile(
          path.resolve(imagePath, `${fileName}_${previewWidth}.webp`)
        )
    }

    await image
      .resize(thumbWidth, thumbHeight, { fit: 'inside' })
      .jpeg({ progressive: true })
      .toFile(
        path.resolve(imagePath, `${fileName}_${thumbWidth}.jpg`)
      )

    await image
      .resize(thumbWidth, thumbHeight, { fit: 'inside' })
      .webp()
      .toFile(
        path.resolve(imagePath, `${fileName}_${thumbWidth}.webp`)
      )

    fs.unlinkSync(file.path)
  })
}
