import { useSelector } from 'react-redux'
import SellerLayout from '../../components/layout/SellerLayout'
import SellerOrdersTable from '../../components/table/SellerOrdersTable'
import { useTranslation } from 'react-i18next'
import { selectAccountUser } from '../../store/slices/accountSlice'
import { selectSellerStore } from '../../store/slices/sellerSlice'

const OrderPage = () => {
  const user = useSelector(selectAccountUser)
  const store = useSelector(selectSellerStore)
  const { t } = useTranslation()

  const paths = [
    { name: t('breadcrumbs.home'), url: `/seller/${store._id}` },
    { name: t('breadcrumbs.order'), url: `/seller/orders/${store._id}` }
  ]

  return (
    <SellerLayout user={user as any} store={store as any} paths={paths}>
      <SellerOrdersTable storeId={store._id} />
    </SellerLayout>
  )
}

export default OrderPage
