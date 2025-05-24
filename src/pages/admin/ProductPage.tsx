import { useSelector } from 'react-redux'
import useToggle from '../../hooks/useToggle'
import AdminLayout from '../../components/layout/AdminLayout'
import AdminProductsTable from '../../components/table/AdminProductsTable'
import { useTranslation } from 'react-i18next'

const ProductPage = () => {
  const { t } = useTranslation()
  const user = useSelector((state: any) => state.account.user)
  const paths = [
    { name: t('breadcrumbs.home'), url: '/admin/dashboard' },
    { name: t('breadcrumbs.product'), url: '/admin/product' }
  ]
  return (
    <AdminLayout user={user} paths={paths}>
      <AdminProductsTable />
    </AdminLayout>
  )
}

export default ProductPage
