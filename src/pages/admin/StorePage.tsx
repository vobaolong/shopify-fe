import { useSelector } from 'react-redux'
import AdminLayout from '../../components/layout/AdminLayout'
import AdminStoresTable from '../../components/table/AdminStoresTable'
import { useTranslation } from 'react-i18next'

const StorePage = () => {
  const user = useSelector((state: any) => state.account.user)
  const { t } = useTranslation()
  const paths = [
    { name: t('breadcrumbs.home'), url: '/admin/dashboard' },
    { name: t('breadcrumbs.store'), url: '/admin/store' }
  ]
  return (
    <AdminLayout user={user} paths={paths}>
      <AdminStoresTable />
    </AdminLayout>
  )
}

export default StorePage
