import { useSelector } from 'react-redux'
import AdminLayout from '../../components/layout/AdminLayout'
import AdminOrdersTable from '../../components/table/AdminOrdersTable'
import { useTranslation } from 'react-i18next'

const OrderPage = () => {
  const user = useSelector((state: any) => state.account.user)
  const { t } = useTranslation()

  const breadcrumbs = [
    { name: t('breadcrumbs.home'), url: '/admin/dashboard' },
    { name: t('breadcrumbs.order'), url: '/admin/orders' }
  ]

  return (
    <AdminLayout user={user} paths={breadcrumbs}>
      <AdminOrdersTable />
    </AdminLayout>
  )
}

export default OrderPage
