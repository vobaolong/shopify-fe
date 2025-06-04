import { useSelector } from 'react-redux'
import AccountLayout from '../../components/layout/AccountLayout'
import UserStoresTable from '../../components/table/UserStoresTable'
import MetaData from '../../components/layout/meta/MetaData'
import { useTranslation } from 'react-i18next'

const StoreManagerPage = () => {
  const user = useSelector((state: any) => state.account.user)
  const { t } = useTranslation()
  const paths = [
    { name: t('breadcrumbs.home'), url: '/' },
    { name: t('breadcrumbs.myStore'), url: '/account/store' }
  ]
  return (
    <AccountLayout user={user} paths={paths}>
      <MetaData title={`${t('helmet.myStore')} | ShopBase Việt Nam`} />
      <UserStoresTable />
    </AccountLayout>
  )
}

export default StoreManagerPage
