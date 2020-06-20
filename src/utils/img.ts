import { Request } from 'express'
import fs from 'fs'
import path from 'path'
import sharp from 'sharp'

type UploadConfig = {
  filenames: number[];
  imagesPath: string;
  maxWidth: number;
  maxHeight: number;
  previewWidth?: number;
  previewHeight?: number;
  thumbWidth: number;
  thumbHeight: number;
}

export const uploadImages = (files: Express.Multer.File[], req: Request, uploadConfig: UploadConfig): void => {
  const {
    filenames,
    imagesPath,
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
    const fileName = filenames[index]

    if ((info.width as number) > maxWidth || (info.height as number) > maxHeight) {
      await image
        .resize(maxWidth, maxHeight, { fit: 'inside' })
        .jpeg({ progressive: true })
        .toFile(
          path.resolve(imagesPath, `${fileName}_${maxWidth}.jpg`)
        )

      await image
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

      await image
        .webp()
        .toFile(
          path.resolve(imagesPath, `${fileName}_${maxWidth}.webp`)
        )
    }

    if (previewWidth === undefined && previewHeight === undefined) {
      await image
        .resize(previewWidth, previewHeight, { fit: 'inside' })
        .jpeg({ progressive: true })
        .toFile(
          path.resolve(imagesPath, `${fileName}_${previewWidth}.jpg`)
        )

      await image
        .resize(previewWidth, previewHeight, { fit: 'inside' })
        .webp()
        .toFile(
          path.resolve(imagesPath, `${fileName}_${previewWidth}.webp`)
        )
    }

    await image
      .resize(thumbWidth, thumbHeight, { fit: 'inside' })
      .jpeg({ progressive: true })
      .toFile(
        path.resolve(imagesPath, `${fileName}_${thumbWidth}.jpg`)
      )

    await image
      .resize(thumbWidth, thumbHeight, { fit: 'inside' })
      .webp()
      .toFile(
        path.resolve(imagesPath, `${fileName}_${thumbWidth}.webp`)
      )

    fs.unlinkSync(file.path)
  })
}
