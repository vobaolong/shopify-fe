import { RcFile } from 'antd/es/upload/interface'
import { Upload } from 'antd'

export const validateImageUpload = (
  file: RcFile,
  t: any,
  message: any,
  maxSize = 5
) => {
  const isValidFormat = /\.(jpg|jpeg|png|gif|webp)$/i.test(file.name)
  if (!isValidFormat) {
    message.error(t('validation.imageFormat'))
    return Upload.LIST_IGNORE
  }

  const isLessThanMaxSize = file.size / 1024 / 1024 < maxSize
  if (!isLessThanMaxSize) {
    message.error(t('validation.imageTooLarge', { size: maxSize }))
    return Upload.LIST_IGNORE
  }

  return true
}

export const createImageFormData = (file: File): FormData => {
  const formData = new FormData()
  formData.set('image', file)
  return formData
}

export const ACCEPTED_IMAGE_TYPES =
  'image/png, image/jpeg, image/jpg, image/gif, image/webp'
