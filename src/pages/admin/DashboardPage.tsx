import { useSelector } from 'react-redux'
import AdminLayout from '../../components/layout/AdminLayout'
import ListStatisticsItems from '../../components/chart/ListStatisticsItems'
import { Role } from '../../enums/OrderStatus.enum'

const DashboardPage = () => {
  const user = useSelector((state: any) => state.account.user)

  return (
    <AdminLayout user={user}>
      <ListStatisticsItems by={Role.ADMIN} />
    </AdminLayout>
  )
}

export default DashboardPage
