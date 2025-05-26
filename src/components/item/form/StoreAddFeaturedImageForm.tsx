import { useState } from 'react'
import { getToken } from '../../../apis/auth.api'
import { addFeaturedImage } from '../../../apis/store.api'
import useUpdateDispatch from '../../../hooks/useUpdateDispatch'
import InputFile from '../../ui/InputFile'
import Error from '../../ui/Error'
import Loading from '../../ui/Loading'
import ConfirmDialog from '../../ui/ConfirmDialog'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { useMutation } from '@tanstack/react-query'
import { AxiosResponse } from 'axios'
import { notification } from 'antd'

interface FeaturedImageState {
  image: string | File
  isValidImage: boolean
}

const StoreAddFeaturedImageForm = ({ storeId = '' }) => {
  const { t } = useTranslation()
  const [error, setError] = useState('')
  const [isConfirming, setIsConfirming] = useState(false)
  const [updateDispatch] = useUpdateDispatch()
  const [featuredImage, setFeaturedImage] = useState<FeaturedImageState>({
    image: '',
    isValidImage: true
  })
  const { _id } = getToken()

  // Mutation for addFeaturedImage
  const addFeaturedImageMutation = useMutation({
    mutationFn: async (image: string | File) => {
      const formData = new FormData()
      formData.set('featured_image', image)
      const res = await addFeaturedImage(_id, formData, storeId)
      return (res as AxiosResponse<any>).data || res
    },
    onSuccess: (data) => {
      if (data.error) {
        notification.error({ message: data.error })
      } else {
        updateDispatch('seller', data.store)
        setFeaturedImage({ image: '', isValidImage: true })
        toast.success(t('toastSuccess.store.addCarousel'))
      }
    },
    onError: () => {
      notification.error({ message: 'Server Error' })
    }
  })

  const handleChange = (
    name: keyof FeaturedImageState,
    isValidName: keyof FeaturedImageState,
    value: string | File
  ) => {
    setFeaturedImage({
      ...featuredImage,
      [name]: value,
      [isValidName]: true
    })
  }

  const handleValidate = (
    isValidName: keyof FeaturedImageState,
    flag: boolean
  ) => {
    setFeaturedImage({
      ...featuredImage,
      [isValidName]: flag
    })
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!featuredImage.image) {
      setFeaturedImage({
        ...featuredImage,
        isValidImage: false
      })
      return
    }
    if (!featuredImage.isValidImage) return
    setIsConfirming(true)
  }

  const onSubmit = () => {
    setError('')
    addFeaturedImageMutation.mutate(featuredImage.image)
    setIsConfirming(false)
  }

  return (
    <div className='position-relative'>
      {addFeaturedImageMutation.isPending && <Loading />}
      {isConfirming && (
        <ConfirmDialog
          title={t('storeDetail.addFeaturedImg')}
          onSubmit={onSubmit}
          onClose={() => setIsConfirming(false)}
          message={t('confirmDialog')}
        />
      )}
      <form className='row mb-2' onSubmit={handleSubmit}>
        <div className='col-12'>
          <InputFile
            label=''
            size='featured'
            defaultSrc={
              typeof featuredImage.image === 'string' ? featuredImage.image : ''
            }
            feedback={t('storeDetailValid.featuredValid')}
            onChange={(value) => handleChange('image', 'isValidImage', value)}
            onValidate={(flag) => handleValidate('isValidImage', flag)}
          />
        </div>
        {error && (
          <div className='col-12'>
            <Error msg={error} />
          </div>
        )}
        <div className='col-12 d-grid mt-4'>
          <button type='submit' className='btn btn-primary ripple rounded-1'>
            {t('button.submit')}
          </button>
        </div>
      </form>
    </div>
  )
}

export default StoreAddFeaturedImageForm
