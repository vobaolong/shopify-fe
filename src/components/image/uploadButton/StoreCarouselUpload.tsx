import { useState } from 'react'
import { getToken } from '../../../apis/auth'
import { updateFeaturedImage, removeFeaturedImage } from '../../../apis/store'
import useUpdateDispatch from '../../../hooks/useUpdateDispatch'
import Loading from '../../ui/Loading'
import ConfirmDialog from '../../ui/ConfirmDialog'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import Error from '../../ui/Error'
import { useMutation } from '@tanstack/react-query'

interface StoreCarouselUploadProps {
  storeId?: string
  index?: number
}

const StoreCarouselUpload = ({
  storeId = '',
  index = 0
}: StoreCarouselUploadProps) => {
  const { t } = useTranslation()
  const [isConfirming, setIsConfirming] = useState(false)
  const { _id } = getToken()
  const [updateDispatch] = useUpdateDispatch()

  const updateMutation = useMutation({
    mutationFn: (formData: FormData) =>
      updateFeaturedImage(_id, formData, index, storeId),
    onSuccess: (res) => {
      const data = res.data || res
      if (!data.error) {
        updateDispatch('seller', data.store)
        toast.success(t('toastSuccess.store.updateCarousel'))
      }
    }
  })

  const removeMutation = useMutation({
    mutationFn: () => removeFeaturedImage(_id, index, storeId),
    onSuccess: (res) => {
      const data = res.data || res
      if (!data.error) {
        updateDispatch('seller', data.store)
        toast.success(t('toastSuccess.store.removeCarousel'))
      }
    }
  })

  const handleUpdateFeaturedImage = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.target.files && e.target.files[0] == null) return
    const formData = new FormData()
    formData.set('photo', e.target.files![0])
    updateMutation.mutate(formData)
  }

  const handleRemove = () => {
    setIsConfirming(true)
  }

  const onRemoveSubmit = () => {
    removeMutation.mutate()
  }

  const error =
    (updateMutation.error && (updateMutation.error as any).message) ||
    (removeMutation.error && (removeMutation.error as any).message) ||
    (updateMutation.data &&
      (updateMutation.data.data || updateMutation.data).error) ||
    (removeMutation.data &&
      (removeMutation.data.data || removeMutation.data).error) ||
    ''
  const isLoading = updateMutation.isPending || removeMutation.isPending

  return (
    <>
      {isLoading && <Loading />}
      {isConfirming && (
        <ConfirmDialog
          title={t('dialog.removeFeatured')}
          onSubmit={onRemoveSubmit}
          message={t('message.delete')}
          color='danger'
          onClose={() => setIsConfirming(false)}
        />
      )}

      <div className='cus-carousel-icon-wrap'>
        <div className='d-flex flex-column'>
          <div className=''>
            <label
              htmlFor={`uploadFeaturedImage-${index}`}
              className='cus-carousel-icon me-2'
            >
              <i className='fa-solid fa-camera'></i>
              <span className='ms-2 res-hide-md'>{t('button.edit')}</span>
              <input
                id={`uploadFeaturedImage-${index}`}
                className='visually-hidden'
                type='file'
                accept='image/png, image/jpeg, image/jpg, image/gif, image/webp'
                onChange={(e) => handleUpdateFeaturedImage(e, index)}
              />
            </label>

            <label
              className='cus-carousel-icon cus-carousel-icon--rm'
              onClick={() => handleRemove()}
            >
              <i className='fa-solid fa-trash-alt'></i>
              <span className='ms-2 res-hide-md'>{t('button.delete')}</span>
            </label>
          </div>

          {error && (
            <div className='bg-body mt-1 px-1 rounded'>
              <Error msg={error} />
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default StoreCarouselUpload
