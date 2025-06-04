import { getToken } from '../../../apis/auth.api'
import { updateCover } from '../../../apis/store.api'
import useUpdateDispatch from '../../../hooks/useUpdateDispatch'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import { useMutation } from '@tanstack/react-query'
import { Alert, Spin } from 'antd'

interface StoreCoverUploadProps {
  storeId: string
}

const StoreCoverUpload = ({ storeId }: StoreCoverUploadProps) => {
  const { _id } = getToken()
  const [updateDispatch] = useUpdateDispatch()
  const { t } = useTranslation()

  const coverMutation = useMutation({
    mutationFn: (formData: FormData) => updateCover(_id, formData, storeId),
    onSuccess: (res) => {
      const data = res.data || res
      if (!data.error) {
        updateDispatch('seller', data.store)
        toast.success(t('toastSuccess.addCover'))
      }
    }
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] == null) return
    const formData = new FormData()
    formData.set('image', e.target.files![0])
    coverMutation.mutate(formData)
  }

  const error =
    (coverMutation.error && (coverMutation.error as any).message) ||
    (coverMutation.data &&
      (coverMutation.data.data || coverMutation.data).error) ||
    ''
  const isLoading = coverMutation.isPending

  return (
    <>
      {error && <Alert type='error' message={error} className='mb-2' />}
      {isLoading && <Spin />}
      <label className='cus-cover-icon'>
        <i className='fa-solid fa-camera' />
        <input
          className='visually-hidden'
          type='file'
          accept='image/png, image/jpeg, image/jpg, image/gif, image/webp'
          onChange={handleChange}
        />
      </label>
    </>
  )
}

export default StoreCoverUpload
