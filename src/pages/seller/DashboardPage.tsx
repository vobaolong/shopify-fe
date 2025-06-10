import { useSelector } from 'react-redux'
import SellerLayout from '../../components/layout/SellerLayout'
import ListStatisticsItems from '../../components/chart/ListStatisticsItems'
import { selectAccountUser } from '../../store/slices/accountSlice'
import { selectSellerStore } from '../../store/slices/sellerSlice'

const DashboardPage = () => {
  const user = useSelector(selectAccountUser)
  const store = useSelector(selectSellerStore)

  return (
    <SellerLayout user={user as any} store={store as any}>
      <ListStatisticsItems by='seller' storeId={store._id as string} />
    </SellerLayout>
  )
}

export default DashboardPage
