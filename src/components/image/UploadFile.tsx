import React, { useState } from 'react'
import { Upload, Button, Image, notification } from 'antd'
import type { UploadProps, UploadFile } from 'antd/es/upload/interface'
import { UploadOutlined } from '@ant-design/icons'

interface UploadFileProps {
  fileList: UploadFile[]
  setFileList: (files: UploadFile[]) => void
  maxCount?: number
  accept?: string
  label?: string
  required?: boolean
  disabled?: boolean
  listType?: UploadProps['listType']
  action?: string
}

const getBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (error) => reject(error)
  })

const UploadFile: React.FC<UploadFileProps> = ({
  fileList,
  setFileList,
  maxCount = 1,
  accept = 'image/*',
  label = 'Upload',
  required = false,
  disabled = false,
  listType = 'picture',
  ...rest
}) => {
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState('')

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

  const uploadProps: UploadProps = {
    fileList,
    onPreview: handlePreview,
    beforeUpload,
    onChange: ({ fileList: newFileList }) =>
      setFileList(newFileList.slice(-maxCount)),
    onRemove: () => {
      setFileList([])
    },
    maxCount,
    accept,
    listType,
    showUploadList: {
      showPreviewIcon: true,
      showRemoveIcon: true,
      showDownloadIcon: false
    },
    disabled,
    ...rest
  }

  return (
    <>
      <Upload {...uploadProps}>
        <Button icon={<UploadOutlined />} disabled={disabled}>
          {label}
        </Button>
      </Upload>
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
    </>
  )
}

export default UploadFile
