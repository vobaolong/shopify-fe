import { useSelector } from 'react-redux'
import StoreLayout from '../../components/layout/StoreLayout'
import Carousel from '../../components/image/Carousel'
import ListProductsByStore from '../../components/list/ListProductsByStore'
import Error from '../../components/ui/Error'
import MainLayout from '../../components/layout/MainLayout'
import { useTranslation } from 'react-i18next'
import MetaData from '../../components/layout/meta/MetaData'

const HomePage = () => {
  const { t } = useTranslation()
  const store = useSelector((state: any) => state.store.store)

  return (
    <>
      <MetaData
        title={`${
          store.name !== undefined ? store.name : ''
        } | Buynow Việt Nam`}
      />
      {typeof store.isActive === 'boolean' && !store.isActive ? (
        <MainLayout>
          <Error msg={t('toastError.storeBanned')} />
        </MainLayout>
      ) : (
        <StoreLayout store={store}>
          <div className='store-home-page'>
            {store.featured_images?.length >= 1 && (
              <div className='mb-4'>
                <Carousel listImages={store.featured_images} alt={store.name} />
              </div>
            )}

            <div className='mb-4'>
              <ListProductsByStore
                heading={t('filters.topSale')}
                storeId={store._id}
              />
            </div>

            <div className='mb-4'>
              <ListProductsByStore
                heading={t('productDetail.newProduct')}
                storeId={store._id}
                sortBy='createdAt'
              />
            </div>
          </div>
        </StoreLayout>
      )}
    </>
  )
}

export default HomePage
