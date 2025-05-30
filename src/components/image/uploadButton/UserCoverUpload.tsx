import { getToken } from '../../../apis/auth.api'
import { updateCover } from '../../../apis/user.api'
import { useMutation } from '@tanstack/react-query'
import { notification, Spin } from 'antd'
import { useTranslation } from 'react-i18next'
import useInvalidate from '../../../hooks/useInvalidate'

const UserCoverUpload = () => {
  const invalidate = useInvalidate()
  const { t } = useTranslation()
  const { _id } = getToken()

  const coverMutation = useMutation({
    mutationFn: (formData: FormData) => updateCover(_id, formData),
    onSuccess: () => {
      invalidate({ queryKey: ['userProfile', _id] })
      notification.success({
        message: t('toastSuccess.userDetail.updateCover')
      })
    },
    onError: (error) => {
      notification.error({ message: error.message })
    }
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] == null) return
    const formData = new FormData()
    formData.set('image', e.target.files![0])
    coverMutation.mutate(formData)
  }

  const isLoading = coverMutation.isPending

  return (
    <>
      {isLoading && <Spin />}
      <label className='cus-cover-icon'>
        <i className='fa-solid fa-camera'></i>
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

export default UserCoverUpload
