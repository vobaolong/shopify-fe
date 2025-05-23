import { useTranslation } from 'react-i18next'

const bgColors = {
  'Not processed': 'warning-rgba',
  Processing: 'orange-rgba',
  Shipped: 'primary-rgba',
  Delivered: 'success-rgba',
  Cancelled: 'danger-rgba',
  Returned: 'danger-rgba'
}
const colors = {
  'Not processed': 'warning',
  Processing: 'orange',
  Shipped: 'primary',
  Delivered: 'success',
  Cancelled: 'danger',
  Returned: 'danger'
}

const OrderStatusLabel = ({ status = '', detail = true }) => {
  const { t } = useTranslation()

  return (
    <span className='d-inline-block position-relative'>
      <span
        className={`badge border rounded-1 text-white bg-${bgColors[status as keyof typeof bgColors]}`}
      >
        {detail && (
          <span className={`text-${colors[status as keyof typeof colors]}`}>
            {t(`orderStatus.${status}`)}
          </span>
        )}
      </span>
    </span>
  )
}

export default OrderStatusLabel
