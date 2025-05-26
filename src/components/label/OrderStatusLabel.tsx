import { useTranslation } from 'react-i18next'
import { Tag } from 'antd'

const statusColors = {
  Pending: 'warning',
  Processing: 'orange',
  Shipped: 'blue',
  Delivered: 'success',
  Cancelled: 'error',
  Returned: 'error'
}

const OrderStatusLabel = ({
  status,
  detail = true
}: {
  status?: string
  detail?: boolean
}) => {
  const { t } = useTranslation()

  return (
    <Tag color={statusColors[status as keyof typeof statusColors]}>
      {detail && t(`orderStatus.${status}`)}
    </Tag>
  )
}

export default OrderStatusLabel
