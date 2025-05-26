import { getToken } from '../../../apis/auth.api'
import useUpdateDispatch from '../../../hooks/useUpdateDispatch'
import Loading from '../../ui/Loading'
import Error from '../../ui/Error'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import { updateAvatar } from '../../../apis/store.api'
import { useMutation } from '@tanstack/react-query'

const UserAvatarUpload = () => {
  const [updateDispatch] = useUpdateDispatch()
  const { t } = useTranslation()
  const { _id } = getToken()

  const avatarMutation = useMutation({
    mutationFn: (formData: FormData) => updateAvatar(_id, formData, ''),
    onSuccess: (res) => {
      const data = res.data || res
      if (!data.error) {
        updateDispatch('account', data.user)
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
    avatarMutation.error?.message ||
    (avatarMutation.data &&
      (avatarMutation.data.data || avatarMutation.data).error) ||
    ''
  const isLoading = avatarMutation.isPending

  return (
    <>
      {isLoading && <Loading />}
      <label className='cus-avatar-icon'>
        <i className='fa-solid fa-camera'></i>
        {error && (
          <span>
            <Error msg={error} />
          </span>
        )}
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
