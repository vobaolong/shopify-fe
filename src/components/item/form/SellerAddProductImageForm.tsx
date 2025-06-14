import { useState } from 'react'
import { getToken } from '../../../apis/auth.api'
import { addListImages } from '../../../apis/product.api'
import { Spin, Upload, Button, Image } from 'antd'
import { useTranslation } from 'react-i18next'
import { useAntdApp } from '../../../hooks/useAntdApp'
import { UploadOutlined } from '@ant-design/icons'
import type { UploadFile } from 'antd/es/upload/interface'

interface SellerAddProductImageFormProps {
  productId: string
  storeId: string
  onRun: () => void
}

const SellerAddProductImageForm = ({
  productId,
  storeId,
  onRun
}: SellerAddProductImageFormProps) => {
  const { t } = useTranslation()
  const { notification } = useAntdApp()
  const [isLoading, setIsLoading] = useState(false)
  const [fileList, setFileList] = useState<UploadFile[]>([])
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (fileList.length === 0) {
      notification.error({ message: t('productValid.otherValid') })
      return
    }

    onSubmit()
  }

  const onSubmit = () => {
    if (fileList.length === 0) return

    const formData = new FormData()
    formData.set('image', fileList[0].originFileObj as File)
    setIsLoading(true)
    addListImages(_id, formData, productId, storeId)
      .then((res: { data: { error?: string } }) => {
        if (res.data.error) notification.error({ message: res.data.error })
        else {
          setFileList([])
          if (onRun) onRun()
          notification.success({ message: 'Image added successfully' })
        }
        setIsLoading(false)
      })
      .catch(() => {
        setIsLoading(false)
        notification.error({ message: 'Server Error' })
      })
  }

  return (
    <div className='relative'>
      {isLoading && <Spin size='large' />}

      <form className='grid grid-cols-1 gap-4 mb-2' onSubmit={handleSubmit}>
        <div className='text-center'>
          <Upload
            listType='picture-card'
            fileList={fileList}
            onPreview={handlePreview}
            beforeUpload={beforeUpload}
            onChange={({ fileList: newFileList }) =>
              setFileList(newFileList.slice(-1))
            }
            onRemove={() => setFileList([])}
            maxCount={1}
            accept='image/*'
          >
            {fileList.length === 0 && (
              <div className='flex flex-col items-center justify-center'>
                <UploadOutlined />
                <div className='mt-2'>Upload</div>
              </div>
            )}
          </Upload>
        </div>

        <div className='w-full'>
          <Button
            type='primary'
            htmlType='submit'
            className='w-full'
            loading={isLoading}
          >
            {t('button.submit')}
          </Button>
        </div>
      </form>

      {previewImage && (
        <Image
          wrapperStyle={{ display: 'none' }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage('')
          }}
          src={previewImage}
        />
      )}
    </div>
  )
}

export default SellerAddProductImageForm
