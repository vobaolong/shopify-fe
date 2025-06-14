import { updateCover } from '../../../apis/store.api'
import useUpdateDispatch from '../../../hooks/useUpdateDispatch'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import { useMutation } from '@tanstack/react-query'
import { Alert, Spin, Upload } from 'antd'
import { CameraOutlined } from '@ant-design/icons'

const StoreCoverUpload = ({ storeId }: { storeId: string }) => {
  const [updateDispatch] = useUpdateDispatch()
  const { t } = useTranslation()
  const coverMutation = useMutation({
    mutationFn: (formData: FormData) => updateCover(formData, storeId),
    onSuccess: (res) => {
      const data = res.data || res
      if (!data.error) {
        updateDispatch('seller', data.store)
        toast.success(t('toastSuccess.addCover'))
      }
    }
  })
  const error =
    (coverMutation.error && (coverMutation.error as any).message) ||
    (coverMutation.data &&
      (coverMutation.data.data || coverMutation.data).error) ||
    ''

  return (
    <>
      {error && <Alert type='error' message={error} className='mb-2' />}
      <div className='cus-cover-icon'>
        <Upload
          showUploadList={false}
          accept='image/png, image/jpeg, image/jpg, image/gif, image/webp'
          beforeUpload={(file) => {
            const isImage = /image\/(jpeg|png|jpg|gif|webp)/.test(file.type)
            if (!isImage) {
              toast.error(t('common.imageFormatError'))
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
    </>
  )
}

export default StoreCoverUpload
