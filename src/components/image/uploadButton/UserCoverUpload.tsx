import { getToken } from '../../../apis/auth'
import { updateCover } from '../../../apis/user'
import useUpdateDispatch from '../../../hooks/useUpdateDispatch'
import Loading from '../../ui/Loading'
import Error from '../../ui/Error'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import { useMutation } from '@tanstack/react-query'

const UserCoverUpload = () => {
  const [updateDispatch] = useUpdateDispatch()
  const { t } = useTranslation()
  const { _id } = getToken()

  const coverMutation = useMutation({
    mutationFn: (formData: FormData) => updateCover(_id, formData),
    onSuccess: (res) => {
      const data = res.data || res
      if (!data.error) {
        toast.success(t('toastSuccess.userDetail.updateCover'))
        updateDispatch('account', data.user)
      }
    }
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] == null) return
    const formData = new FormData()
    formData.set('photo', e.target.files![0])
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
      {isLoading && <Loading />}
      <label className='cus-cover-icon'>
        <i className='fa-solid fa-camera'></i>
        {error && <Error msg={error} />}
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
