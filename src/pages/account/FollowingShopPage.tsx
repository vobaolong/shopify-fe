import { useSelector } from 'react-redux'
import AccountLayout from '../../components/layout/AccountLayout'
import FollowingCollection from '../../components/collection/FollowingCollection'
import { useTranslation } from 'react-i18next'
import MetaData from '../../components/layout/meta/MetaData'

const FollowingShopPage = () => {
  const { t } = useTranslation()
  const user = useSelector((state: any) => state.account.user)
  const paths = [
    { name: t('breadcrumbs.home'), url: '/' },
    { name: t('breadcrumbs.favStore'), url: '/account/following-shop' }
  ]
  return (
    <AccountLayout user={user} paths={paths}>
      <MetaData title={`${t('favStore')} | ShopBase Việt Nam`} />
      <FollowingCollection heading />
    </AccountLayout>
  )
}

export default FollowingShopPage
