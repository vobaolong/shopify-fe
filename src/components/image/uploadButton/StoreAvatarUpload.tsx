import useUpdateDispatch from '../../../hooks/useUpdateDispatch'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import { updateAvatar } from '../../../apis/store.api'
import { useMutation } from '@tanstack/react-query'
import { Spin, Alert } from 'antd'

interface StoreAvatarUploadProps {
  storeId?: string
}

const StoreAvatarUpload = ({ storeId = '' }: StoreAvatarUploadProps) => {
  const [updateDispatch] = useUpdateDispatch()
  const { t } = useTranslation()

  const avatarMutation = useMutation({
    mutationFn: (formData: FormData) => updateAvatar(formData, storeId),
    onSuccess: (res) => {
      const data = res.data || res
      if (!data.error) {
        updateDispatch('seller', data.store)
        toast.success(t('toastSuccess.addAvatar'))
      }
    }
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] == null) return
    const formData = new FormData()
    formData.set('photo', e.target.files![0])
    avatarMutation.mutate(formData)
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
      {isLoading && <Spin />}
      <label className='cus-avatar-icon'>
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

export default StoreAvatarUpload
