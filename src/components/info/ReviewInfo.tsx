import { useState } from 'react'
import { getToken } from '../../apis/auth.api'
import { deleteReview } from '../../apis/review.api'
import StarRating from '../label/StarRating'
import ProductSmallCard from '../card/ProductSmallCard'
import { Spin, Alert, Button, Typography } from 'antd'
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

const { Text } = Typography

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
    <div className='row py-2 border-b position-relative'>
      {isPending && (
        <div className='flex justify-center p-2'>
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

      <div className='col-12 px-1 flex justify-between items-center'>
        <div className='flex justify-between flex-grow'>
          <small className='hidden-avatar d-inline-flex gap-2'>
            <StarRating stars={review.rating} />
            <Text type='secondary' className='text-xs'>
              {(review.rating === 5 && t('reviewDetail.amazing')) ||
                (review.rating === 4 && t('reviewDetail.good')) ||
                (review.rating === 3 && t('reviewDetail.fair')) ||
                (review.rating === 2 && t('reviewDetail.poor')) ||
                (review.rating === 1 && t('reviewDetail.terrible'))}
            </Text>
            <span className='text-primary font-medium'>
              {review?.userId?.userName} {review?.userId?.name}
            </span>
            <span className='text-success rounded px-1 bg-green-100 my-auto'>
              <i className='fa-regular fa-circle-check' />{' '}
              {t('productDetail.purchased')}
            </span>
            {about && (
              <ProductSmallCard borderName={true} product={review.productId} />
            )}
          </small>
          <span className='text-xs text-gray-500'>
            {humanReadableDate(review.createdAt)}
          </span>
        </div>
      </div>
      <div className='col-10 mt-1 px-1'>
        <Text style={{ fontSize: '0.9rem' }}>{review.content}</Text>
      </div>
      {getToken()?._id === review.userId?._id && isReviewAllowed && (
        <div className='col-2 flex justify-end items-end flex-wrap px-1 mt-1'>
          <div className='flex justify-between'>
            <div className='menu-container'>
              <Button
                className='menu-button'
                onClick={handleMenuToggle}
                size='small'
                icon={<i className='fa fa-ellipsis-v' />}
              />
              {showMenu && (
                <div className='menu flex flex-col gap-2 items-start p-2'>
                  <EditReviewItem oldReview={review} onRun={onRun} />
                  <hr className='m-0' />
                  <Button
                    type='primary'
                    danger
                    size='small'
                    className='w-full text-start'
                    onClick={handleRemove}
                    icon={<i className='fa-solid fa-trash-alt me-2' />}
                  >
                    {t('reviewDetail.delete')}
                  </Button>
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
