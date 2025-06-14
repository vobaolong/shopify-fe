import useUpdateDispatch from '../../../hooks/useUpdateDispatch'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import { updateAvatar } from '../../../apis/store.api'
import { useMutation } from '@tanstack/react-query'
import { Upload, Spin, Alert, message } from 'antd'
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface'
import { CameraOutlined } from '@ant-design/icons'

interface StoreAvatarUploadProps {
  storeId?: string
}

const StoreAvatarUpload = ({ storeId = '' }: StoreAvatarUploadProps) => {
  const [updateDispatch] = useUpdateDispatch()
  const { t } = useTranslation()

  const avatarMutation = useMutation({
    mutationFn: (formData: FormData) => updateAvatar(storeId, formData),
    onSuccess: (res) => {
      const data = res.data || res
      if (!data.error) {
        updateDispatch('seller', data.store)
        toast.success(t('toastSuccess.addAvatar'))
      }
    }
  })

  const beforeUpload = (file: RcFile) => {
    const isValidFormat = /\.(jpg|jpeg|png|gif|webp)$/i.test(file.name)
    if (!isValidFormat) {
      message.error(t('validation.imageFormat'))
      return Upload.LIST_IGNORE
    }

    const isLessThan5M = file.size / 1024 / 1024 < 5
    if (!isLessThan5M) {
      message.error(t('validation.imageTooLarge', { size: 5 }))
      return Upload.LIST_IGNORE
    }
    return true
  }

  const customUpload = async (options: any) => {
    const { file, onError } = options
    try {
      const formData = new FormData()
      formData.set('image', file)
      avatarMutation.mutate(formData)
    } catch (err) {
      onError(err)
    }
  }
  const error =
    (avatarMutation.error && (avatarMutation.error as any).message) ||
    (avatarMutation.data &&
      (avatarMutation.data.data || avatarMutation.data).error) ||
    ''
  const isLoading = avatarMutation.isPending

  return (
    <>
      {error && <Alert type='error' message={error} className='mb-2' />}
      <div className='cus-avatar-icon'>
        <Upload
          name='image'
          showUploadList={false}
          beforeUpload={beforeUpload}
          customRequest={customUpload}
          accept='image/png, image/jpeg, image/jpg, image/gif, image/webp'
          disabled={isLoading}
        >
          <Spin spinning={isLoading}>
            <CameraOutlined />
          </Spin>
        </Upload>
      </div>
    </>
  )
}

export default StoreAvatarUpload
