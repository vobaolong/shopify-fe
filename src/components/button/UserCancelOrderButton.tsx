import { useState, useCallback } from 'react'
import { getToken } from '../../apis/auth.api'
import { calcTime } from '../../helper/calcTime'
import ConfirmDialog from '../ui/ConfirmDialog'
import { useTranslation } from 'react-i18next'
import { notification, Spin } from 'antd'
import { socketId } from '../../socket'
import { OrderStatus } from '../../enums/OrderStatus.enum'
import { useUserCancelOrder } from '../../hooks/useOrder'

interface UserCancelOrderButtonProps {
  orderId: string
  status: string
  detail: boolean
  createdAt: string
  onRun: () => void
}

const UserCancelOrderButton = ({
  orderId,
  status,
  detail,
  createdAt,
  onRun
}: UserCancelOrderButtonProps) => {
  const { t } = useTranslation()
  const [isConfirming, setIsConfirming] = useState(false)
  const { _id } = getToken()
  const { mutate, isPending, error } = useUserCancelOrder()

  const handleCancelOrder = useCallback(() => {
    setIsConfirming(true)
  }, [])
  const onSubmit = useCallback(() => {
    mutate(
      { userId: _id, status: OrderStatus.CANCELLED, orderId },
      {
        onSuccess: (data: any) => {
          const order = data?.data?.order
          socketId.emit('notificationCancel', {
            objectId: order._id,
            from: _id,
            to: order.storeId._id
          })
          notification.success({
            message: t('toastSuccess.order.cancel')
          })
          if (onRun) onRun()
        },
        onError: (error) => {
          notification.error({
            message: t('error.general'),
            description: error instanceof Error ? error.message : String(error)
          })
        }
      }
    )
    setIsConfirming(false)
  }, [mutate, _id, orderId, onRun, t])

  const disabled =
    status !== OrderStatus.PENDING || calcTime(createdAt) >= 1 || isPending
  return (
    <div className='relative'>
      {isConfirming && (
        <ConfirmDialog
          title='Cancel Order'
          color='danger'
          onSubmit={onSubmit}
          onClose={() => setIsConfirming(false)}
        />
      )}
      <div className='d-inline-block cus-tooltip'>
        <button
          type='button'
          className='btn btn-outline-danger ripple rounded-1'
          disabled={disabled}
          onClick={handleCancelOrder}
        >
          {isPending && <Spin size='small' style={{ marginRight: '8px' }} />}
          <i className='fa-solid fa-ban'></i>
          {detail && <span className='ms-2'>{t('button.cancel')}</span>}
        </button>
      </div>
      {(Boolean(status && status !== OrderStatus.PENDING) ||
        calcTime(createdAt) >= 1) && (
        <small className='cus-tooltip-msg'>{t('status.cantCancelOrder')}</small>
      )}
    </div>
  )
}

export default UserCancelOrderButton
