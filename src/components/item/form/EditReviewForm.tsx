import { useState, useEffect } from 'react'
import { getToken } from '../../../apis/auth.api'
import { updateReview } from '../../../apis/review.api'
import { numberTest, regexTest } from '../../../helper/test'
import TextArea from '../../ui/TextArea'
import RatingInput from '../../ui/RatingInput'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { useMutation } from '@tanstack/react-query'
import { useAntdApp } from '../../../hooks/useAntdApp'
import { Spin } from 'antd'

interface ReviewType {
  rating: number
  content: string
  _id: string
}

interface EditReviewFormProps {
  oldReview?: ReviewType
  onRun?: () => void
}

const EditReviewForm = ({ oldReview, onRun }: EditReviewFormProps) => {
  const { t } = useTranslation()
  const { notification } = useAntdApp()
  const [newReview, setNewReview] = useState({
    rating: 1,
    content: '',
    isValidRating: true,
    isValidContent: true
  })
  const { _id } = getToken()

  const updateReviewMutation = useMutation({
    mutationFn: (review: typeof newReview) =>
      updateReview(_id, review, oldReview?._id || ''),
    onSuccess: (res: { data: { error?: string } }) => {
      if (res.data.error) {
        notification.error({ message: res.data.error })
      } else {
        if (onRun) {
          onRun()
          toast.success(t('toastSuccess.review.update'))
        }
      }
    },
    onError: () => {
      notification.error({ message: 'Server Error' })
    }
  })

  useEffect(() => {
    if (oldReview) {
      setNewReview((prev) => ({
        ...prev,
        rating: oldReview.rating,
        content: oldReview.content
      }))
    }
  }, [oldReview])

  const handleChange = (
    name: 'rating' | 'content',
    isValidName: 'isValidRating' | 'isValidContent',
    value: any
  ) => {
    setNewReview({
      ...newReview,
      [name]: value,
      [isValidName]: true
    })
  }

  const handleValidate = (
    isValidName: 'isValidRating' | 'isValidContent',
    flag: boolean
  ) => {
    setNewReview({
      ...newReview,
      [isValidName]: flag
    })
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!newReview.rating) {
      setNewReview({
        ...newReview,
        isValidRating: numberTest('oneTo5', newReview.rating),
        isValidContent: regexTest('nullable', newReview.content)
      })
      return
    }
    if (!newReview.isValidRating || !newReview.isValidContent) return
    updateReviewMutation.mutate(newReview)
  }

  return (
    <div className='relative'>
      {updateReviewMutation.isPending && <Spin />}

      <form className='row mb-2' onSubmit={handleSubmit}>
        <div className='col-12'>
          <RatingInput
            label={t('reviewDetail.productQuality')}
            value={newReview.rating}
            isValid={newReview.isValidRating}
            feedback={t('reviewDetail.isValid')}
            onChange={(value) => handleChange('rating', 'isValidRating', value)}
          />
        </div>

        <div className='col-12 mt-3'>
          <TextArea
            label={t('reviewDetail.content')}
            value={newReview.content}
            isValid={newReview.isValidContent}
            feedback={t('reviewDetail.isValid')}
            validator='nullable'
            onChange={(value) =>
              handleChange('content', 'isValidContent', value)
            }
            onValidate={(flag) => handleValidate('isValidContent', flag)}
          />
        </div>

        <div className='col-12 d-grid mt-4'>
          <button type='submit' className='btn btn-primary ripple rounded-1'>
            {t('button.edit')}
          </button>
        </div>
      </form>
    </div>
  )
}

export default EditReviewForm
