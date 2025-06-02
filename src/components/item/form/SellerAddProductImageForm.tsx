import { useState } from 'react'
import { getToken } from '../../../apis/auth.api'
import { addListImages } from '../../../apis/product.api'
import InputFile from '../../ui/InputFile'
import Loading from '../../ui/Loading'
import ConfirmDialog from '../../ui/ConfirmDialog'
import { useTranslation } from 'react-i18next'
import Error from '../../ui/Error'
import { useAntdApp } from '../../../hooks/useAntdApp'

interface SellerAddProductImageFormProps {
  productId: string
  storeId: string
  onRun: () => void
}

const SellerAddProductImageForm = ({
  productId,
  storeId,
  onRun
}: SellerAddProductImageFormProps) => {
  const { t } = useTranslation()
  const { notification } = useAntdApp()
  const [isLoading, setIsLoading] = useState(false)
  const [newImage, setNewImages] = useState({
    image: '',
    isValidImage: true
  })

  const { _id } = getToken()

  const handleChange = (
    name: 'image',
    isValidName: 'isValidImage',
    value: any
  ) => {
    setNewImages({
      ...newImage,
      [name]: value,
      [isValidName]: true
    })
  }

  const handleValidate = (isValidName: 'isValidImage', flag: boolean) => {
    setNewImages({
      ...newImage,
      [isValidName]: flag
    })
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!newImage.image) {
      setNewImages({
        ...newImage,
        isValidImage: false
      })
      return
    }

    if (!newImage.isValidImage) return

    onSubmit()
  }

  const onSubmit = () => {
    const formData = new FormData()
    formData.set('photo', newImage.image)
    setIsLoading(true)
    addListImages(_id, formData, productId, storeId)
      .then((res: { data: { error?: string } }) => {
        if (res.data.error) notification.error({ message: res.data.error })
        else {
          setNewImages({
            image: '',
            isValidImage: true
          })
          if (onRun) onRun()
        }
        setIsLoading(false)
        notification.success({ message: 'Image added successfully' })
      })
      .catch(() => {
        setIsLoading(false)
        notification.error({ message: 'Server Error' })
      })
  }

  return (
    <div className='position-relative'>
      {isLoading && <Loading />}

      <form className='row mb-2' onSubmit={handleSubmit}>
        <div className='col-12 text-center'>
          <InputFile
            label=''
            size='avatar'
            noRadius={false}
            defaultSrc={newImage.image}
            feedback={t('productValid.otherValid')}
            onChange={(value) => handleChange('image', 'isValidImage', value)}
            onValidate={(flag) => handleValidate('isValidImage', flag)}
          />
        </div>

        <div className='col-12 d-grid mt-4'>
          <button type='submit' className='btn btn-primary ripple rounded-1'>
            {t('button.submit')}
          </button>
        </div>
      </form>
    </div>
  )
}

export default SellerAddProductImageForm
