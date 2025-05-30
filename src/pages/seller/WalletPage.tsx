import { useSelector } from 'react-redux'
import SellerLayout from '../../components/layout/SellerLayout'
import TransactionsTable from '../../components/table/TransactionsTable'
import { useTranslation } from 'react-i18next'
import { selectAccountUser } from '../../store/slices/accountSlice'
import { selectSellerStore } from '../../store/slices/sellerSlice'

const WalletPage = () => {
  const user = useSelector(selectAccountUser)
  const store = useSelector(selectSellerStore)
  const { t } = useTranslation()

  const paths = [
    { name: t('breadcrumbs.home'), url: `/seller/${store._id}` },
    { name: t('breadcrumbs.wallet'), url: `/seller/wallet/${store._id}` }
  ]
  return (
    <SellerLayout user={user} store={store} paths={paths}>
      <TransactionsTable
        storeId={store._id}
        owner={store.ownerId}
        eWallet={store.e_wallet ? store.e_wallet?.$numberDecimal : 0}
        by='store'
      />
    </SellerLayout>
  )
}

export default WalletPage
