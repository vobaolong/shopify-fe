import useUpdateDispatch from '../../../hooks/useUpdateDispatch'
import { useTranslation } from 'react-i18next'
import { updateAvatar } from '../../../apis/store.api'
import { useMutation } from '@tanstack/react-query'
import { useAntdApp } from '../../../hooks/useAntdApp'
import ImageUploader from './ImageUploader'

const StoreAvatarUpload = ({ storeId }: { storeId: string }) => {
  const [updateDispatch] = useUpdateDispatch()
  const { t } = useTranslation()
  const { notification } = useAntdApp()

  const avatarMutation = useMutation({
    mutationFn: (formData: FormData) => updateAvatar(storeId, formData),
    onSuccess: (res) => {
      const data = res.data || res
      if (!data.error) {
        updateDispatch('seller', data.store)
        notification.success({ message: t('toastSuccess.addAvatar') })
      }
    }
  })

  const handleUpload = (file: File) => {
    const formData = new FormData()
    formData.set('image', file)
    avatarMutation.mutate(formData)
  }

  const error = avatarMutation.error?.message
  return (
    <ImageUploader
      onUpload={handleUpload}
      error={error}
      isLoading={avatarMutation.isPending}
    />
  )
}

export default StoreAvatarUpload
