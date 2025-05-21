/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react'
import { getToken } from '../../../apis/auth'
import { reviewProduct } from '../../../apis/review'
import { numberTest, regexTest } from '../../../helper/test'
import Loading from '../../ui/Loading'
import ConfirmDialog from '../../ui/ConfirmDialog'
import TextArea from '../../ui/TextArea'
import RatingInput from '../../ui/RatingInput'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import Error from '../../ui/Error'

interface ReviewFormProps {
  storeId?: string
  orderId?: string
  productId?: string
  productName?: string
  productImage?: string[]
  productVariant?: string
  productVariantValue?: string
  onRun?: () => void
}

const ReviewForm = ({
  storeId = '',
  orderId = '',
  productId = '',
  productName = '',
  productImage = [],
  productVariant = '',
  productVariantValue = '',
  onRun
}: ReviewFormProps) => {
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)
  const [isConfirming, setIsConfirming] = useState(false)
  const [error, setError] = useState('')
  const [review, setReview] = useState({
    storeId,
    orderId,
    productId,
    productName,
    productImage,
    productVariant,
    productVariantValue,
    rating: 4,
    content: '',
    isValidRating: true,
    isValidContent: true
  })

  const { _id } = getToken()

  useEffect(() => {
    setReview({
      ...review,
      storeId,
      orderId,
      productId
    })
  }, [storeId, productId, orderId])

  const handleChange = (
    name: keyof typeof review,
    isValidName: keyof typeof review,
    value: any
  ) => {
    setReview({
      ...review,
      [name]: value,
      [isValidName]: true
    })
  }

  const handleValidate = (isValidName: keyof typeof review, flag: boolean) => {
    setReview({
      ...review,
      [isValidName]: flag
    })
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (
      !review.storeId ||
      !review.orderId ||
      !review.productId ||
      !review.rating
    ) {
      setReview({
        ...review,
        isValidRating: numberTest('oneTo5', review.rating),
        isValidContent: regexTest('nullable', review.content)
      })
      return
    }

    if (!review.isValidRating || !review.isValidContent) return

    onSubmit()
  }

  const onSubmit = () => {
    setError('')
    setIsLoading(true)
    reviewProduct(_id, review)
      .then((res: { data: { error?: string } }) => {
        if (res.data.error) setError(res.data.error)
        else {
          toast.success(t('toastSuccess.review.add'))
          if (onRun) onRun()
        }
        setIsLoading(false)
        setTimeout(() => {
          setError('')
        }, 3000)
      })
      .catch(() => {
        setError('Server Error')
        setIsLoading(false)
        setTimeout(() => {
          setError('')
        }, 3000)
      })
  }

  return (
    <div className='position-relative'>
      {isLoading && <Loading />}
      {isConfirming && (
        <ConfirmDialog
          title={t('productDetail.productReview')}
          onSubmit={onSubmit}
          message={t('confirmDialog')}
          onClose={() => setIsConfirming(false)}
        />
      )}

      {error && <Error msg={error} />}

      <form className='row mb-2' onSubmit={handleSubmit}>
        <div className='col-12'>
          <div className='d-flex'>
            <img
              className='w-15 rounded-1 me-2'
              alt='review.productName'
              src={
                Array.isArray(review.productImage)
                  ? review.productImage[0] || ''
                  : review.productImage
              }
            />
            <div className='d-grid'>
              <span>{review.productName}</span>
              <small>
                {review.productVariant}: {review.productVariantValue}
              </small>
            </div>
          </div>
          <RatingInput
            label={t('reviewDetail.productQuality')}
            value={review.rating}
            isValid={review.isValidRating}
            feedback={t('reviewDetail.isValid')}
            onChange={(value) => handleChange('rating', 'isValidRating', value)}
          />
        </div>

        <div className='col-12 mt-3'>
          <TextArea
            label={t('reviewDetail.content')}
            value={review.content}
            isValid={review.isValidContent}
            feedback={t('reviewDetail.isValid')}
            validator='nullable'
            onChange={(value) =>
              handleChange('content', 'isValidContent', value)
            }
            onValidate={(flag) => handleValidate('isValidContent', flag)}
          />
        </div>

        <div className='col-sm-12 col-md-6 ms-auto d-grid mt-4'>
          <button type='submit' className='btn btn-primary ripple rounded-1'>
            {t('button.submit')}
          </button>
        </div>
      </form>
    </div>
  )
}

export default ReviewForm
