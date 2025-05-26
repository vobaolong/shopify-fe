import { useTranslation } from 'react-i18next'
import { Tag } from 'antd'

const OrderPaymentLabel = ({ isPaidBefore = false, detail = true }) => {
  const { t } = useTranslation()
  return (
    <Tag color={isPaidBefore ? 'blue' : 'red'}>
      {detail &&
        t(isPaidBefore ? 'orderDetail.onlinePayment' : 'orderDetail.cod')}
    </Tag>
  )
}

export default OrderPaymentLabel
