import { useState } from 'react'
import { getToken } from '../../../apis/auth.api'
import { addFeaturedImage } from '../../../apis/store.api'
import useUpdateDispatch from '../../../hooks/useUpdateDispatch'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { useMutation } from '@tanstack/react-query'
import { AxiosResponse } from 'axios'
import { useAntdApp } from '../../../hooks/useAntdApp'
import { Button, Alert, Spin, Upload, Modal, Image } from 'antd'
import { UploadOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import type { UploadFile } from 'antd/es/upload/interface'
import ConfirmDialog from '../../ui/ConfirmDialog'
import InputFile from '../../ui/InputFile'

interface FeaturedImageState {
  fileList: UploadFile[]
  isValid: boolean
  image: string | File
  isValidImage: boolean
}

const StoreAddFeaturedImageForm = ({ storeId = '' }) => {
  const { t } = useTranslation()
  const { notification } = useAntdApp()
  const [error, setError] = useState('')
  const [updateDispatch] = useUpdateDispatch()
  const [isConfirming, setIsConfirming] = useState(false)
  const [featuredImage, setFeaturedImage] = useState<FeaturedImageState>({
    fileList: [],
    isValid: true,
    image: '',
    isValidImage: true
  })
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState('')
  const { _id } = getToken()

  const getBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = (error) => reject(error)
    })

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as File)
    }
    setPreviewImage(file.url || (file.preview as string))
    setPreviewOpen(true)
  }

  const beforeUpload = (file: File) => {
    const isImage = file.type.startsWith('image/')
    if (!isImage) {
      notification.error({ message: 'You can only upload image files!' })
      return false
    }
    const isLt2M = file.size / 1024 / 1024 < 2
    if (!isLt2M) {
      notification.error({ message: 'Image must smaller than 2MB!' })
      return false
    }
    return false // prevent auto upload
  }

  // Mutation for addFeaturedImage
  const addFeaturedImageMutation = useMutation({
    mutationFn: async (image: string | File) => {
      const formData = new FormData()
      formData.set('featured_image', image)
      const res = await addFeaturedImage(_id, formData, storeId)
      return (res as AxiosResponse<any>).data || res
    },
    onSuccess: (data) => {
      if (data.error) {
        notification.error({ message: data.error })
      } else {
        updateDispatch('seller', data.store)
        setFeaturedImage({
          fileList: [],
          isValid: true,
          image: '',
          isValidImage: true
        })
        toast.success(t('toastSuccess.store.addCarousel'))
      }
    },
    onError: () => {
      notification.error({ message: 'Server Error' })
    }
  })
  const handleChange = (
    name: keyof FeaturedImageState,
    isValidName: keyof FeaturedImageState,
    value: any
  ) => {
    setFeaturedImage({
      ...featuredImage,
      [name]: value,
      [isValidName]: true
    })
  }

  const handleValidate = (
    isValidName: keyof FeaturedImageState,
    flag: boolean
  ) => {
    setFeaturedImage({
      ...featuredImage,
      [isValidName]: flag
    })
  }
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!featuredImage.image) {
      setFeaturedImage({
        ...featuredImage,
        isValidImage: false
      })
      return
    }
    if (!featuredImage.isValidImage) return
    setIsConfirming(true)
  }

  const onSubmit = () => {
    setError('')
    addFeaturedImageMutation.mutate(featuredImage.image)
    setIsConfirming(false)
  }

  return (
    <div className='relative'>
      <Spin spinning={addFeaturedImageMutation.isPending}>
        {isConfirming && (
          <ConfirmDialog
            title={t('storeDetail.addFeaturedImg')}
            onSubmit={onSubmit}
            onClose={() => setIsConfirming(false)}
            message={t('confirmDialog')}
          />
        )}
        <form className='w-full' onSubmit={handleSubmit}>
          <div className='mb-4'>
            <InputFile
              label=''
              size='featured'
              defaultSrc={
                typeof featuredImage.image === 'string'
                  ? featuredImage.image
                  : ''
              }
              feedback={t('storeDetailValid.featuredValid')}
              onChange={(value) => handleChange('image', 'isValidImage', value)}
              onValidate={(flag) => handleValidate('isValidImage', flag)}
            />
          </div>

          {error && (
            <div className='mb-4'>
              <Alert message={error} type='error' showIcon />
            </div>
          )}

          <div className='mt-6'>
            <Button
              type='primary'
              htmlType='submit'
              loading={addFeaturedImageMutation.isPending}
              className='w-full'
            >
              {t('button.submit')}
            </Button>
          </div>
        </form>
      </Spin>
    </div>
  )
}

export default StoreAddFeaturedImageForm
