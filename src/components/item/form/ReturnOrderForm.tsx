import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { socketId } from '../../../socket'
import { toast } from 'react-toastify'
import ConfirmDialog from '../../ui/ConfirmDialog'
import { createReturnRequest } from '../../../apis/order'
import { getToken } from '../../../apis/auth'

interface Reason {
  value: string
  label: string
}

interface ReturnOrderFormProps {
  reasons: Reason[]
  orderId: string
  userId: string
  storeId: string
}

const ReturnOrderForm: React.FC<ReturnOrderFormProps> = ({
  reasons,
  orderId,
  userId,
  storeId
}) => {
  const [selectedReason, setSelectedReason] = useState('')
  const { t } = useTranslation()
  const { _id } = getToken()

  const handleReasonChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedReason(event.target.value)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit()
  }

  const onSubmit = async () => {
    if (selectedReason) {
      try {
        console.log('Submitting report with data:', {
          userId,
          orderId,
          reason: selectedReason
        })
        await createReturnRequest(_id, orderId, selectedReason)
        socketId.emit('createNotificationReturn', {
          objectId: orderId,
          from: userId,
          to: storeId
        })
        toast.success('Gửi yêu cầu thành công')
      } catch (error) {
        console.error('Error reporting:', error)
        toast.error('Error submitting report')
      }
    } else {
      console.error('Please select a reason for reporting.')
      toast.error('Please select a reason for reporting.')
    }
  }

  return (
    <div className='position-relative'>
      <form onSubmit={handleSubmit}>
        <div className='mb-3 d-flex flex-column gap-2'>
          <label className='form-label'>Chọn lý do</label>
          {reasons.map((reason: Reason) => (
            <div className='form-check' key={reason.value}>
              <input
                className='form-check-input pointer'
                type='radio'
                name='reportReason'
                id={reason.value}
                value={reason.value}
                checked={selectedReason === reason.value}
                onChange={handleReasonChange}
              />
              <label className='form-check-label' htmlFor={reason.value}>
                {reason.label}
              </label>
              <hr className='m-2' />
            </div>
          ))}
        </div>
        <div className='d-flex justify-content-end'>
          <button
            type='submit'
            className='mt-3 btn btn-primary ripple text-nowrap rounded-1 w-50'
            disabled={!selectedReason}
          >
            {t('button.submit')}
          </button>
        </div>
      </form>
    </div>
  )
}

export default ReturnOrderForm
