import { getToken } from '../../../apis/auth.api'
import { updateCover } from '../../../apis/user.api'
import { useMutation } from '@tanstack/react-query'
import { Upload, Spin } from 'antd'
import { CameraOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import useInvalidate from '../../../hooks/useInvalidate'
import { useAntdApp } from '../../../hooks/useAntdApp'

const UserCoverUpload = () => {
  const invalidate = useInvalidate()
  const { t } = useTranslation()
  const { _id } = getToken()
  const { notification } = useAntdApp()
  const coverMutation = useMutation({
    mutationFn: (formData: FormData) => updateCover(_id, formData),
    onSuccess: () => {
      invalidate({ queryKey: ['userProfilePage', _id] })
      invalidate({ queryKey: ['userAccountInit', _id] })
      invalidate({ queryKey: ['adminProfilePage', _id] })
      notification.success({
        message: t('toastSuccess.userDetail.updateCover')
      })
    }
  })
  return (
    <div className='cus-cover-icon'>
      <Upload
        showUploadList={false}
        accept='image/png, image/jpeg, image/jpg, image/gif, image/webp'
        beforeUpload={(file) => {
          const isImage = /image\/(jpeg|png|jpg|gif|webp)/.test(file.type)
          if (!isImage) {
            notification.error({ message: t('common.imageFormatError') })
            return Upload.LIST_IGNORE
          }
          const formData = new FormData()
          formData.append('image', file)
          coverMutation.mutate(formData)
          return false
        }}
        disabled={coverMutation.isPending}
      >
        <Spin spinning={coverMutation.isPending}>
          <CameraOutlined />
        </Spin>
      </Upload>
    </div>
  )
}

export default UserCoverUpload
