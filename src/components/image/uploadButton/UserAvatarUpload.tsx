import { getToken } from '../../../apis/auth.api'
import { useTranslation } from 'react-i18next'
import { updateAvatar } from '../../../apis/user.api'
import { useMutation } from '@tanstack/react-query'
import { notification, Spin } from 'antd'
import useInvalidate from '../../../hooks/useInvalidate'

const UserAvatarUpload = () => {
  const { t } = useTranslation()
  const { _id } = getToken()
  const invalidate = useInvalidate()

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] == null) return
    const formData = new FormData()
    formData.set('image', e.target.files![0])
    avatarMutation.mutate(formData)
  }

  const isLoading = avatarMutation.isPending

  return (
    <>
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

export default UserAvatarUpload
