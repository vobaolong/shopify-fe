import { useState, Fragment } from 'react'
import { getToken } from '../../../apis/auth'
import { updateListImages, removeListImages } from '../../../apis/product'
import Loading from '../../ui/Loading'
import ConfirmDialog from '../../ui/ConfirmDialog'
import { useTranslation } from 'react-i18next'
import Error from '../../ui/Error'
import { useMutation } from '@tanstack/react-query'

interface ProductUploadProps {
  storeId?: string
  productId?: string
  index?: number
  onRun?: () => void
}

const ProductUpload = ({
  storeId = '',
  productId = '',
  index = 0,
  onRun
}: ProductUploadProps) => {
  const [isConfirming, setIsConfirming] = useState(false)
  const { t } = useTranslation()
  const { _id } = getToken()

  // Mutation for updating image
  const updateImageMutation = useMutation({
    mutationFn: (formData: FormData) =>
      updateListImages(_id, formData, index, productId, storeId),
    onSuccess: (res) => {
      const data = res.data || res
      if (!data.error && onRun) onRun()
    }
  })

  // Mutation for removing image
  const removeImageMutation = useMutation({
    mutationFn: () => removeListImages(_id, index, productId, storeId),
    onSuccess: (res) => {
      const data = res.data || res
      if (!data.error && onRun) onRun()
    }
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] == null) return
    const formData = new FormData()
    formData.set('photo', e.target.files![0])
    updateImageMutation.mutate(formData)
  }

  const handleRemove = () => {
    setIsConfirming(true)
  }

  const onRemoveSubmit = () => {
    removeImageMutation.mutate()
  }

  const error =
    (updateImageMutation.error && (updateImageMutation.error as any).message) ||
    (removeImageMutation.error && (removeImageMutation.error as any).message) ||
    (updateImageMutation.data &&
      (updateImageMutation.data.data || updateImageMutation.data).error) ||
    (removeImageMutation.data &&
      (removeImageMutation.data.data || removeImageMutation.data).error) ||
    ''

  const isLoading =
    updateImageMutation.isPending || removeImageMutation.isPending

  return (
    <Fragment>
      {isLoading && <Loading />}
      {isConfirming && (
        <div className='text-start'>
          <ConfirmDialog
            title={t('dialog.removeImg')}
            message={t('confirmDialog')}
            color='danger'
            onSubmit={onRemoveSubmit}
            onClose={() => setIsConfirming(false)}
          />
        </div>
      )}

      {index > 0 && (
        <label
          className='cus-avatar-icon cus-avatar-icon--rm'
          onClick={handleRemove}
        >
          <i className='fa-solid fa-times'></i>
        </label>
      )}

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
    </Fragment>
  )
}

export default ProductUpload
