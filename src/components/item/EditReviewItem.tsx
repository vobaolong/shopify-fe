import Modal from '../ui/Modal'
import { useTranslation } from 'react-i18next'
import EditReviewForm from './form/EditReviewForm'

interface ReviewType {
  rating: number
  content: string
  _id: string
}

interface EditReviewItemProps {
  oldReview?: ReviewType
  onRun?: () => void
}

const EditReviewItem = ({
  oldReview = { rating: 1, content: '', _id: '' },
  onRun
}: EditReviewItemProps) => {
  const { t } = useTranslation()
  return (
    <div className='d-inline-block '>
      <button
        type='button'
        data-bs-target={`#review-edit-form-${oldReview._id}`}
        data-bs-toggle='modal'
        className='btn btn-sm ripple text-primary-rgba'
      >
        <i className='fa-duotone fa-pen-to-square me-2'></i>
        {t('reviewDetail.edit')}
      </button>

      <Modal
        hasCloseBtn={false}
        title={t('reviewDetail.edit')}
        id={`review-edit-form-${oldReview._id}`}
      >
        <EditReviewForm oldReview={oldReview} onRun={onRun} />
      </Modal>
    </div>
  )
}

export default EditReviewItem
