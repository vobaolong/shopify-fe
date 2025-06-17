import { useState, useCallback } from 'react'
import { getToken } from '../../apis/auth.api'
import { calcTime } from '../../helper/calcTime'
import ConfirmDialog from '../ui/ConfirmDialog'
import { useTranslation } from 'react-i18next'
import { , Button, Tooltip } from 'antd'
import { socketId } from '../../socket'
import { OrderStatus } from '../../enums/OrderStatus.enum'
import { useUserCancelOrder } from '../../hooks/useOrder'
import { useAntdApp } from '../../hooks/useAntdApp'

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
const { notification} = useAntdApp()
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

  const isOrderNonPending = Boolean(status && status !== OrderStatus.PENDING)
  const isTimeExpired = calcTime(createdAt) >= 1
  const showTooltip = isOrderNonPending || isTimeExpired

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
      <Tooltip
        title={showTooltip ? t('status.cantCancelOrder') : ''}
        placement='top'
      >
        <Button
          type='default'
          danger
          disabled={disabled}
          onClick={handleCancelOrder}
          loading={isPending}
          icon={<i className='fa-solid fa-ban' />}
          className='flex items-center gap-2'
        >
          {detail && <span>{t('button.cancel')}</span>}
        </Button>
      </Tooltip>
    </div>
  )
}

export default UserCancelOrderButton
