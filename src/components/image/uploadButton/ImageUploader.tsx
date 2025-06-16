import React from 'react'
import { Upload, Spin, Alert } from 'antd'
import { CameraOutlined } from '@ant-design/icons'
import {
  validateImageUpload,
  ACCEPTED_IMAGE_TYPES
} from '../../../utils/uploadUtils'
import { useTranslation } from 'react-i18next'
import { useAntdApp } from '../../../hooks/useAntdApp'

interface ImageUploaderProps {
  onUpload: (file: File) => void
  error?: string | null
  isLoading?: boolean
  icon?: React.ReactNode
  maxSize?: number
  className?: string
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  onUpload,
  error,
  isLoading = false,
  icon = <CameraOutlined />,
  maxSize = 5,
  className = 'cus-avatar-icon'
}) => {
  const { t } = useTranslation()
  const { message } = useAntdApp()
  const beforeUpload = (file: any) => {
    return validateImageUpload(file, t, message, maxSize)
  }
  const customUpload = async (options: any) => {
    const { file, onError } = options
    try {
      onUpload(file)
    } catch (err) {
      onError(err)
    }
  }

  return (
    <>
      {error && <Alert type='error' message={error} className='mb-2' />}
      <div className={className}>
        <Upload
          name='image'
          showUploadList={false}
          beforeUpload={beforeUpload}
          customRequest={customUpload}
          accept={ACCEPTED_IMAGE_TYPES}
          disabled={isLoading}
        >
          <Spin spinning={isLoading}>{icon}</Spin>
        </Upload>
      </div>
    </>
  )
}

export default ImageUploader
