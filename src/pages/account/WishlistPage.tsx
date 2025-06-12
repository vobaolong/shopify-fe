import { useSelector } from 'react-redux'
import AccountLayout from '../../components/layout/AccountLayout'
import WishlistCollection from '../../components/collection/WishlistCollection'
import { useTranslation } from 'react-i18next'
import MetaData from '../../components/layout/meta/MetaData'

const WishlistPage = () => {
  const { t } = useTranslation()
  const user = useSelector((state: any) => state.account.user)
  const paths = [
    { name: t('breadcrumbs.home'), url: '/' },
    { name: t('breadcrumbs.listFavorites'), url: '/account/following/wishlist' }
  ]
  return (
    <AccountLayout user={user} paths={paths}>
      <MetaData title={`${t('favProduct')} | ShopBase Việt Nam`} />
      <WishlistCollection heading />
    </AccountLayout>
  )
}

export default WishlistPage
