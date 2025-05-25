import { useSelector } from 'react-redux'
import AdminLayout from '../../components/layout/AdminLayout'
import { useTranslation } from 'react-i18next'
import AdminUpsertCategoryForm from '../../components/item/form/AdminUpsertCategoryForm'

const CreateCategoryPage = () => {
  const { t } = useTranslation()
  const user = useSelector((state: any) => state.account.user)
  const paths = [
    { name: t('breadcrumbs.home'), url: '/admin/dashboard' },
    { name: t('breadcrumbs.category'), url: '/admin/category' },
    {
      name: t('breadcrumbs.addCategory'),
      url: '/admin/category/create'
    }
  ]
  return (
    <AdminLayout user={user} paths={paths}>
      <AdminUpsertCategoryForm />
    </AdminLayout>
  )
}

export default CreateCategoryPage
