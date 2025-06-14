import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import useUpdateDispatch from '../../hooks/useUpdateDispatch'
import SellerLayout from '../../components/layout/SellerLayout'
import Cover from '../../components/image/Cover'
import Avatar from '../../components/image/Avatar'
import Carousel from '../../components/image/Carousel'
import OpenCloseStoreButton from '../../components/button/OpenCloseStoreButton'
import StoreAddFeaturedImageItem from '../../components/item/StoreAddFeaturedImageItem'
import StoreStatusLabel from '../../components/label/StoreStatusLabel'
import StoreLevelInfo from '../../components/info/StoreLevelInfo'
import StoreProfileInfo from '../../components/info/StoreProfileInfo'
import { useTranslation } from 'react-i18next'
import StoreActiveLabel from '../../components/label/StoreActiveLabel'
import { selectAccountUser } from '../../store/slices/accountSlice'
import { selectSellerStore } from '../../store/slices/sellerSlice'

const ProfilePage = () => {
  const { t } = useTranslation()
  const user = useSelector(selectAccountUser)
  const store = useSelector(selectSellerStore)
  const [updateDispatch] = useUpdateDispatch()
  const onHandleRun = (newStore: any) => {
    updateDispatch('seller', newStore)
  }

  const paths = [
    { name: t('breadcrumbs.home'), url: `/seller/${store._id}` },
    { name: t('breadcrumbs.shopProfile'), url: `/seller/profile/${store._id}` }
  ]

  return (
    <SellerLayout user={user as any} store={store as any} paths={paths}>
      <div>
        <div className='flex items-center bg-white rounded-md shadow p-3 gap-3 w-full'>
          <div className='relative w-1/2'>
            <Cover
              cover={store.cover}
              alt={store.name}
              isEditStore={true}
              storeId={store._id}
            />
            <div className='absolute left-6 transform -translate-y-1/2 top-1/2'>
              <Avatar
                avatar={store.avatar}
                alt={store.name}
                isEditable='store'
                storeId={store._id}
              />
            </div>
          </div>
          <div className='flex-1'>
            <StoreLevelInfo store={store} />
          </div>
        </div>

        {store.featured_images?.length > 0 && (
          <div className='my-2'>
            <Carousel
              listImages={store.featured_images}
              alt={store.name as string}
              isEditStore
              storeId={store._id}
              style={{ minHeight: 'auto' }}
            />
          </div>
        )}

        <div className='items-center bg-white box-shadow flex justify-content-between my-3 px-4 py-3 rounded-1'>
          <div className='flex justify-content-between align-items-start'>
            <StoreAddFeaturedImageItem
              count={store.featured_images?.length}
              storeId={store._id}
            />
            <div className='cus-tooltip ms-2 m-auto'>
              <StoreActiveLabel isActive={store.isActive} detail={true} />
            </div>
          </div>

          <Link
            className='btn btn-outline-primary ripple btn-sm'
            to={`/store/${store._id}`}
            target='_blank'
          >
            <i className='fa-solid fa-desktop me-2' />
            <span>{t('storeDetail.viewShop')}</span>
          </Link>
        </div>

        <div className='items-center bg-white box-shadow flex justify-content-between my-3 p-4 rounded-1'>
          <div className='flex items-center gap-3'>
            <div className='d-grid'>
              <span style={{ fontSize: '1.1rem' }}>
                {t('storeDetail.vacationMode')}{' '}
                <i className='fa-light fa-moon text-secondary' />
              </span>
              <small className='text-secondary'>
                {t('storeDetail.vacationModeContent')}
              </small>
            </div>
          </div>
          <div className='position-relative ms-3'>
            <OpenCloseStoreButton
              storeId={store._id}
              isOpen={store.isOpen}
              onRun={(store: any) => onHandleRun(store)}
            />
          </div>
        </div>
        <div className='mt-3'>
          <StoreProfileInfo
            store={store as any}
            showProfile={true}
            isEditable={true}
          />
        </div>
      </div>
    </SellerLayout>
  )
}

export default ProfilePage
