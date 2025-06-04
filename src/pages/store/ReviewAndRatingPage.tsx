import { useSelector } from 'react-redux'
import StoreLayout from '../../components/layout/StoreLayout'
import MainLayout from '../../components/layout/MainLayout'
import { Alert } from 'antd'
import ListReviews from '../../components/list/ListReviews'
import { useTranslation } from 'react-i18next'
import { selectStoreStore } from '../../store/slices/storeSlice'

const ReviewAndRatingPage = () => {
  const store = useSelector(selectStoreStore)
  const { t } = useTranslation()
  const paths = [
    { name: t('breadcrumbs.home'), url: '/' },
    { name: `${store.name}`, url: `/store/${store._id}` },
    { name: t('breadcrumbs.rating'), url: `/store/rating/${store._id}` }
  ]
  return typeof store.isActive === 'boolean' && !store.isActive ? (
    <MainLayout>
      <Alert message={t('toastError.storeBanned')} type='error' showIcon />
    </MainLayout>
  ) : (
    <StoreLayout store={store} paths={paths}>
      <div style={{ margin: '0 auto' }}>
        <div className='mt-4'>
          <ListReviews storeId={store._id} />
        </div>
      </div>
    </StoreLayout>
  )
}

export default ReviewAndRatingPage
