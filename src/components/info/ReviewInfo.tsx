import { useState } from 'react'
import { getToken } from '../../apis/auth.api'
import { deleteReview } from '../../apis/review.api'
import StarRating from '../label/StarRating'
import ProductSmallCard from '../card/ProductSmallCard'
import { Spin, Alert } from 'antd'
import ConfirmDialog from '../ui/ConfirmDialog'
import EditReviewItem from '../item/EditReviewItem'
import { humanReadableDate } from '../../helper/humanReadable'
import { useTranslation } from 'react-i18next'
import { calcTime } from '../../helper/calcTime'
import { toast } from 'react-toastify'
import { useMutation } from '@tanstack/react-query'

interface ReviewInfoProps {
  review: any
  about?: boolean
  onRun?: () => void
}

const ReviewInfo: React.FC<ReviewInfoProps> = ({
  review = {},
  about = true,
  onRun
}) => {
  const { t } = useTranslation()
  const [isConfirming, setIsConfirming] = useState(false)
  const [showMenu, setShowMenu] = useState(false)

  const { mutate, isPending, error } = useMutation({
    mutationFn: () => deleteReview(getToken()._id, review._id),
    onSuccess: (data) => {
      if (!data.data.error && onRun) {
        onRun()
        toast.success(t('toastSuccess.review.delete'))
      }
    }
  })

  const handleMenuToggle = () => {
    setShowMenu(!showMenu)
  }
  const handleRemove = () => {
    if (!isReviewAllowed) return
    setIsConfirming(true)
  }

  const onSubmit = () => {
    setIsConfirming(false)
    mutate()
  }
  const hoursDifference = calcTime(review?.orderId?.updatedAt)
  const isReviewAllowed = hoursDifference < 720 //30days
  return (
    <div className='row py-2 border-bottom position-relative'>
      {isPending && (
        <div className='flex justify-content-center p-2'>
          <Spin size='small' />
        </div>
      )}
      {error && (
        <Alert message={(error as any).message} type='error' showIcon />
      )}
      {isConfirming && (
        <ConfirmDialog
          title={t('reviewDetail.delete')}
          message={t('message.delete')}
          onSubmit={onSubmit}
          onClose={() => setIsConfirming(false)}
          color='danger'
        />
      )}

      <div className='col-12 px-1 flex justify-content-between items-center'>
        <div className='flex justify-content-between flex-grow-1'>
          <small className='hidden-avatar d-inline-flex gap-2'>
            <StarRating stars={review.rating} />
            <small className='text-secondary'>
              {(review.rating === 5 && t('reviewDetail.amazing')) ||
                (review.rating === 4 && t('reviewDetail.good')) ||
                (review.rating === 3 && t('reviewDetail.fair')) ||
                (review.rating === 2 && t('reviewDetail.poor')) ||
                (review.rating === 1 && t('reviewDetail.terrible'))}
            </small>
            <span className='text-primary fw-medium'>
              {review?.userId?.userName} {review?.userId?.name}
            </span>
            {/* <span className='text-secondary'>{review?.productId?.name}</span> */}
            <span className='text-success rounded-1 px-1 bg-success-rgba my-auto'>
              <i className='fa-regular fa-circle-check' />{' '}
              {t('productDetail.purchased')}
            </span>
            {about && (
              <ProductSmallCard borderName={true} product={review.productId} />
            )}
          </small>

          <span style={{ fontSize: '0.8rem', color: '#555' }}>
            {humanReadableDate(review.createdAt)}
          </span>
        </div>
      </div>
      <div className='col-10 mt-1 px-1'>
        <span style={{ fontSize: '0.9rem' }}>{review.content}</span>
      </div>
      {getToken()?._id === review.userId?._id && isReviewAllowed && (
        <div className='col-2 flex justify-content-end align-items-end flex-wrap px-1 mt-1'>
          <div className='flex justify-content-between'>
            <div className='menu-container'>
              <button className='btn menu-button' onClick={handleMenuToggle}>
                <i className='fa fa-ellipsis-v' />
              </button>
              {showMenu && (
                <div className='menu flex flex-column gap-2 align-item-start p-2'>
                  <EditReviewItem oldReview={review} onRun={onRun} />
                  <hr className='m-0' />
                  <button
                    type='button'
                    className='btn rounded-1 btn-sm ripple rm-review w-100 text-start'
                    onClick={handleRemove}
                  >
                    <i className='fa-solid fa-trash-alt me-2' />
                    {t('reviewDetail.delete')}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ReviewInfo
