import { useSelector } from 'react-redux'
import AdminLayout from '../../components/layout/AdminLayout'
import AdminLevelsTable from '../../components/table/AdminLevelsTable'
import { useTranslation } from 'react-i18next'

const LevelPage = () => {
  const { t } = useTranslation()
  const user = useSelector((state: any) => state.account.user)

  const breadcrumbs = [
    { name: t('breadcrumbs.home'), url: '/admin/dashboard' },
    { name: t('breadcrumbs.level'), url: '/admin/levels' }
  ]

  return (
    <AdminLayout user={user} paths={breadcrumbs}>
      <AdminLevelsTable />
    </AdminLayout>
  )
}

export default LevelPage
