import { useSelector } from 'react-redux'
import StoreLayout from '../../components/layout/StoreLayout'
import StoreProfileInfo from '../../components/info/StoreProfileInfo'
import StoreLevelInfo from '../../components/info/StoreLevelInfo'
import MainLayout from '../../components/layout/MainLayout'
import { Alert } from 'antd'
import { useTranslation } from 'react-i18next'
import { selectStoreStore } from '../../store/slices/storeSlice'

const AboutPage = () => {
  const store = useSelector(selectStoreStore)
  const { t } = useTranslation()
  const paths = [
    { name: t('breadcrumbs.home'), url: '/' },
    { name: `${store.name}`, url: `/store/${store._id}` },
    { name: t('breadcrumbs.about'), url: `/store/about/${store._id}` }
  ]
  return typeof store.isActive === 'boolean' && !store.isActive ? (
    <MainLayout>
      <Alert message={t('toastError.storeBanned')} type='error' showIcon />
    </MainLayout>
  ) : (
    <StoreLayout store={store} paths={paths}>
      <div style={{ margin: '0 auto' }}>
        <div className='mb-1 d-none res-dis'>
          <StoreLevelInfo store={store} />
        </div>
        <div className='mb-1'>
          <StoreProfileInfo store={store} showProfile={false} />
        </div>
      </div>
    </StoreLayout>
  )
}

export default AboutPage
