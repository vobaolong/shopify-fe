import { useState, useCallback } from 'react'
import { getToken } from '../../apis/auth'
import { useUserCancelOrder } from '../../hooks/useUserCancelOrder'
import { calcTime } from '../../helper/calcTime'
import Loading from '../ui/Loading'
import ConfirmDialog from '../ui/ConfirmDialog'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { socketId } from '../../socket'
import Error from '../ui/Error'
import { OrderStatus } from '../../enums/OrderStatus.enum'

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
  const { isPending, error, mutate } = useUserCancelOrder()

  const handleCancelOrder = useCallback(() => {
    setIsConfirming(true)
  }, [])

  const onSubmit = useCallback(() => {
    mutate(
      { userId: _id, orderId },
      {
        onSuccess: (data: any) => {
          const order = data?.data?.order
          socketId.emit('notificationCancel', {
            objectId: order._id,
            from: _id,
            to: order.storeId._id
          })
          toast.success(t('toastSuccess.order.cancel'))
          if (onRun) onRun()
        }
      }
    )
    setIsConfirming(false)
  }, [mutate, _id, orderId, onRun, t])

  const disabled =
    status !== OrderStatus.NOT_PROCESSED ||
    calcTime(createdAt) >= 1 ||
    isPending

  return (
    <div className='relative'>
      {isPending && <Loading />}
      {error && (
        <Error msg={error instanceof Error ? error.message : String(error)} />
      )}
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
          <i className='fa-solid fa-ban'></i>
          {detail && <span className='ms-2'>{t('button.cancel')}</span>}
        </button>
      </div>
      {(Boolean(status && status !== OrderStatus.NOT_PROCESSED) ||
        calcTime(createdAt) >= 1) && (
        <small className='cus-tooltip-msg'>{t('status.cantCancelOrder')}</small>
      )}
    </div>
  )
}

export default UserCancelOrderButton
