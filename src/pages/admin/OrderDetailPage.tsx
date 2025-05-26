import { useSelector } from 'react-redux'
import { useParams, Link } from 'react-router-dom'
import AdminLayout from '../../components/layout/AdminLayout'
import { useTranslation } from 'react-i18next'
import OrderDetailDrawer from '../../components/info/OrderDetailInfo'

const OrderDetailPage = () => {
  const user = useSelector((state: any) => state.account.user)
  const { orderId } = useParams()
  const { t } = useTranslation()
  const paths = [
    { name: t('breadcrumbs.home'), url: '/admin/dashboard' },
    { name: t('breadcrumbs.order'), url: '/admin/order' },
    {
      name: t('breadcrumbs.orderDetail'),
      url: `/admin/order/detail/${orderId}`
    }
  ]

  return (
    <AdminLayout user={user} paths={paths}>
      <div className='res-mx--12-md bg-white rounded-1 box-shadow p-4'>
        <OrderDetailDrawer orderId={orderId} by='admin' isEditable={true} />
      </div>
    </AdminLayout>
  )
}

export default OrderDetailPage
