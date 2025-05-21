import { useState, useEffect, useCallback, useMemo } from 'react'
import { getToken } from '../../apis/auth'
import { useSellerUpdateOrderStatus } from '../../hooks/useSellerUpdateOrderStatus'
import Loading from '../ui/Loading'
import ConfirmDialog from '../ui/ConfirmDialog'
import DropDownMenu from '../ui/DropDownMenu'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import Error from '../ui/Error'
import { socketId } from '../../socket'
import { OrderStatus } from '../../enums/OrderStatus.enum'

interface SellerUpdateOrderStatusProps {
  storeId?: string
  orderId?: string
  status?: string
  onRun?: () => void
}

const SellerUpdateOrderStatus = ({
  storeId = '',
  orderId = '',
  status = '',
  onRun
}: SellerUpdateOrderStatusProps) => {
  const [isConfirming, setIsConfirming] = useState(false)
  const [statusValue, setStatusValue] = useState(status)
  const { _id } = getToken()
  const { t } = useTranslation()
  const mutation = useSellerUpdateOrderStatus()
  const { isPending, error, mutate } = mutation

  useEffect(() => {
    setStatusValue(status)
  }, [status])

  const handleUpdate = useCallback((value: string) => {
    setStatusValue(value)
    setIsConfirming(true)
  }, [])

  const onSubmit = useCallback(() => {
    mutate(
      { userId: _id, status: statusValue, orderId, storeId },
      {
        onSuccess: (data: any) => {
          const order = data?.data?.order
          if (statusValue === OrderStatus.DELIVERED && order) {
            socketId.emit('createNotificationDelivered', {
              objectId: order._id,
              from: _id,
              to: order.userId?._id ?? order.userId
            })
          }
          toast.success(t('toastSuccess.order.update'))
          if (onRun) onRun()
        }
      }
    )
  }, [mutate, _id, statusValue, orderId, storeId, t, onRun])

  const getStatusOptions = useMemo(() => {
    const options = [
      { label: t('status.notProcessed'), value: OrderStatus.NOT_PROCESSED },
      { label: t('status.processing'), value: OrderStatus.PROCESSING },
      { label: t('status.shipped'), value: OrderStatus.SHIPPED },
      { label: t('status.delivered'), value: OrderStatus.DELIVERED },
      { label: t('status.cancel'), value: OrderStatus.CANCELLED }
    ]
    switch (statusValue) {
      case OrderStatus.NOT_PROCESSED:
        return options.filter(
          (option) =>
            ![
              OrderStatus.SHIPPED,
              OrderStatus.DELIVERED,
              OrderStatus.NOT_PROCESSED
            ].includes(option.value)
        )
      case OrderStatus.PROCESSING:
        return options.filter(
          (option) =>
            ![
              OrderStatus.NOT_PROCESSED,
              OrderStatus.DELIVERED,
              OrderStatus.PROCESSING
            ].includes(option.value)
        )
      case OrderStatus.SHIPPED:
        return options.filter(
          (option) =>
            ![
              OrderStatus.NOT_PROCESSED,
              OrderStatus.PROCESSING,
              OrderStatus.SHIPPED,
              OrderStatus.CANCELLED
            ].includes(option.value)
        )
      case OrderStatus.DELIVERED:
      case OrderStatus.CANCELLED:
        return options.filter((option) => option.value === statusValue)
      default:
        return options
    }
  }, [statusValue, t])

  return (
    <div className='position-relative'>
      {isPending && <Loading />}
      {error && (
        <Error msg={error instanceof Error ? error.message : String(error)} />
      )}
      {isConfirming && (
        <ConfirmDialog
          title={t('dialog.updateOrder')}
          onSubmit={onSubmit}
          onClose={() => setIsConfirming(false)}
          message={t('confirmDialog')}
        />
      )}

      <DropDownMenu
        listItem={getStatusOptions}
        size='lg'
        value={statusValue}
        setValue={handleUpdate}
        borderBtn={false}
      />
    </div>
  )
}

export default SellerUpdateOrderStatus
