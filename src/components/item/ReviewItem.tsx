/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react'
import { getToken } from '../../apis/auth.api'
import { checkReview } from '../../apis/review.api'
import ReviewForm from './form/ReviewForm'
import { humanReadableDate } from '../../helper/humanReadable'
import { calcTime } from '../../helper/calcTime'
import { useTranslation } from 'react-i18next'
import { Button, Modal, Spin, Tooltip } from 'antd'
import { CommentOutlined } from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'

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
  onRun?: () => void
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
  date = '',
  onRun
}: ReviewItemProps) => {
  const { t } = useTranslation()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [deliveredDate, setDeliveredDate] = useState<Date>(
    date ? new Date(date) : new Date()
  )

  useEffect(() => {
    const newDate = new Date(date)
    newDate.setDate(newDate.getDate() + 30)
    setDeliveredDate(newDate)
  }, [date])

  const { _id } = getToken()

  const { data: reviewData, isLoading } = useQuery({
    queryKey: ['checkReview', _id, orderId, productId],
    queryFn: async () => {
      const response = await checkReview(_id, { orderId, productId })
      return response.data.success
    },
    enabled: !!_id && !!orderId && !!productId
  })

  const isReviewed = reviewData || false

  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  const handleReviewSuccess = () => {
    setIsModalOpen(false)
    if (onRun) onRun()
  }

  return (
    <div className='relative inline-block'>
      <Spin spinning={isLoading}>
        <div className='flex justify-end'>
          <Tooltip
            title={
              isReviewed
                ? t('reviewDetail.reviewed')
                : calcTime(deliveredDate) > 0
                  ? `${t('reviewDetail.cannotReview')} ${humanReadableDate(deliveredDate)}.`
                  : ''
            }
          >
            <Button
              size='small'
              type='primary'
              icon={<CommentOutlined />}
              disabled={isReviewed || calcTime(deliveredDate) > 0}
              className='text-nowrap rounded'
              onClick={showModal}
            >
              {detail && (
                <span className='ml-1 hidden lg:inline'>
                  {t('filters.rating')}
                </span>
              )}
            </Button>
          </Tooltip>
        </div>

        {!isReviewed && (
          <div className='mt-1 text-xs text-gray-500'>
            {t('reviewDetail.ratingBy')}{' '}
            <Tooltip
              title={`${t('reviewDetail.cannotReview')} ${humanReadableDate(deliveredDate)}.`}
            >
              <span className='underline cursor-help'>
                {humanReadableDate(deliveredDate)}
              </span>
            </Tooltip>
          </div>
        )}

        {!isReviewed && (
          <Modal
            open={isModalOpen}
            onCancel={handleCancel}
            footer={null}
            title={t('productDetail.productReview')}
            destroyOnHidden
          >
            <ReviewForm
              orderId={orderId}
              storeId={storeId}
              productId={productId}
              productName={productName}
              productImage={productImage}
              productVariant={productVariant}
              productVariantValue={productVariantValue}
              onRun={handleReviewSuccess}
            />
          </Modal>
        )}
      </Spin>
    </div>
  )
}

export default ReviewItem
