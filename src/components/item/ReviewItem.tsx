/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react'
import { getToken } from '../../apis/auth.api'
import { checkReview } from '../../apis/review.api'
import Loading from '../ui/Loading'
import Modal from '../ui/Modal'
import ReviewForm from './form/ReviewForm'
import { humanReadableDate } from '../../helper/humanReadable'
import { calcTime } from '../../helper/calcTime'
import { useTranslation } from 'react-i18next'

interface ReviewItemProps {
  orderId?: string
  storeId?: string
  productId?: string
  productName?: string
  productImage?: string[]
  productVariant?: string
  productVariantValue?: string
  detail?: boolean
  date?: string
}

const ReviewItem = ({
  orderId = '',
  storeId = '',
  productId = '',
  productName = '',
  productImage = [],
  productVariant = '',
  productVariantValue = '',
  detail = true,
  date = ''
}: ReviewItemProps) => {
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)
  const [isReviewed, setIsReviewed] = useState(false)
  const [deliveredDate, setDeliveredDate] = useState<Date>(
    date ? new Date(date) : new Date()
  )

  useEffect(() => {
    const newDate = new Date(date)
    newDate.setDate(newDate.getDate() + 30)
    setDeliveredDate(newDate)
  }, [date])

  const init = () => {
    const { _id } = getToken()
    setIsLoading(true)
    checkReview(_id, { orderId, productId })
      .then((res) => {
        if (res.data.success) setIsReviewed(true)
        else setIsReviewed(false)
        setIsLoading(false)
      })
      .catch((error) => {
        setIsReviewed(false)
        setIsLoading(false)
      })
  }
  useEffect(() => {
    init()
  }, [orderId, storeId, productId])

  return (
    <div className='review-item position-relative d-inline-block'>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <div className='cus-tooltip d-flex justify-content-end'>
            {calcTime(deliveredDate) > 0}
            <button
              type='button'
              disabled={isReviewed || calcTime(deliveredDate) > 0}
              className='btn btn-primary ripple text-nowrap rounded-1'
              data-bs-toggle='modal'
              data-bs-target='#review-form'
            >
              <i className='fa-solid fa-comment-dots'></i>
              {detail && (
                <span className='ms-2 res-hide-lg'>{t('filters.rating')}</span>
              )}
            </button>
            {!isReviewed && (
              <Modal
                id='review-form'
                hasCloseBtn={false}
                title={t('productDetail.productReview')}
              >
                <ReviewForm
                  orderId={orderId}
                  storeId={storeId}
                  productId={productId}
                  productName={productName}
                  productImage={productImage}
                  productVariant={productVariant}
                  productVariantValue={productVariantValue}
                  onRun={() => setIsReviewed(true)}
                />
              </Modal>
            )}
          </div>
          {!isReviewed && (
            <small>
              {t('reviewDetail.ratingBy')}
              <u
                title={`${t('reviewDetail.cannotReview')} ${humanReadableDate(
                  deliveredDate
                )}.`}
                style={{ cursor: 'help' }}
              >
                {humanReadableDate(deliveredDate)}
              </u>
            </small>
          )}
          {isReviewed && (
            <small className='cus-tooltip-msg'>Sản phẩm đã được đánh giá</small>
          )}
        </>
      )}
    </div>
  )
}

export default ReviewItem
