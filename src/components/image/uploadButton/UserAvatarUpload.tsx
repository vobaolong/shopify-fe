import { getToken } from '../../../apis/auth.api'
import { useTranslation } from 'react-i18next'
import { updateAvatar } from '../../../apis/user.api'
import { useMutation } from '@tanstack/react-query'
import useInvalidate from '../../../hooks/useInvalidate'
import { useAntdApp } from '../../../hooks/useAntdApp'
import ImageUploader from './ImageUploader'

const UserAvatarUpload = () => {
  const { t } = useTranslation()
  const { _id } = getToken()
  const invalidate = useInvalidate()
  const { notification } = useAntdApp()

  const avatarMutation = useMutation({
    mutationFn: (formData: FormData) => updateAvatar(_id, formData),
    onSuccess: () => {
      invalidate({ queryKey: ['userProfilePage', _id] })
      invalidate({ queryKey: ['userAccountInit', _id] })
      invalidate({ queryKey: ['adminProfilePage', _id] })
      notification.success({ message: t('toastSuccess.addAvatar') })
    },
    onError: (error) => {
      notification.error({ message: error.message })
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

export default UserAvatarUpload
