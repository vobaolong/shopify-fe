import { useSelector } from 'react-redux'
import { memo, useMemo } from 'react'
import AdminLayout from '../../components/layout/AdminLayout'
import { useTranslation } from 'react-i18next'
import AdminReportsTable from '../../components/table/AdminReportsTable'

const ReportPage = () => {
  const { t } = useTranslation()
  const user = useSelector((state: any) => state.account.user)

  const breadcrumbs = useMemo(
    () => [
      { name: t('breadcrumbs.home'), url: '/admin/dashboard' },
      { name: t('breadcrumbs.report'), url: '/admin/reports' }
    ],
    [t]
  )

  return (
    <AdminLayout user={user} paths={breadcrumbs}>
      <AdminReportsTable />
    </AdminLayout>
  )
}

export default memo(ReportPage)
