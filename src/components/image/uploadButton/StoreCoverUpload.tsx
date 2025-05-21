import { getToken } from '../../../apis/auth'
import { updateCover } from '../../../apis/store'
import useUpdateDispatch from '../../../hooks/useUpdateDispatch'
import Loading from '../../ui/Loading'
import Error from '../../ui/Error'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import { useMutation } from '@tanstack/react-query'

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

export default StoreCoverUpload
