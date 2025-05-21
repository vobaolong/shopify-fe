import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { reportByUser } from '../../../apis/report'
import { socketId } from '../../../socket'
import { toast } from 'react-toastify'
import ConfirmDialog from '../../ui/ConfirmDialog'

interface Reason {
  value: string
  label: string
}

interface ListComplaintProps {
  reasons: Reason[]
  objectId: string
  reportBy: string
  isStore: boolean
}

const ListComplaint = ({
  reasons,
  objectId,
  reportBy,
  isStore
}: ListComplaintProps) => {
  const [selectedReason, setSelectedReason] = useState('')
  const { t } = useTranslation()

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
          objectId,
          reportBy,
          reason: selectedReason,
          isStore
        })
        await reportByUser({
          objectId: objectId,
          reportBy: reportBy,
          reason: selectedReason,
          isStore: isStore
        })
        socketId.emit('notificationReport', {
          objectId: objectId,
          from: reportBy,
          to: import.meta.env.ADMIN_ID
        })
        toast.success('Gửi khiếu nại thành công')
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
          <label className='form-label'>Chọn lý do báo cáo</label>
          {reasons.map((reason) => (
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
            </div>
          ))}
        </div>
        <div className='d-flex justify-content-end'>
          <button
            type='submit'
            className='mt-3 btn btn-primary ripple text-nowrap rounded-1 w-50'
          >
            {t('button.submit')}
          </button>
        </div>
      </form>
    </div>
  )
}

export default ListComplaint
