import { Fragment } from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Avatar, Card, Menu, Spin, Alert } from 'antd'
import {
  ShopOutlined,
  FileTextOutlined,
  LeftOutlined,
  UserOutlined
} from '@ant-design/icons'
import { connect } from 'react-redux'
import { getToken } from '../../apis/auth.api'
import { getStoreProfile } from '../../apis/store.api'
import { getStoreLevel } from '../../apis/level.api'
import { getStoreFollowerCount } from '../../apis/followStore.api'
import { countOrder } from '../../apis/order.api'
import { useTranslation } from 'react-i18next'
import { addSeller } from '../../store/slices/sellerSlice'

interface SellerInitProps {
  store: any
  actions: (store: any) => void
}

const SellerInit = ({ store, actions }: SellerInitProps) => {
  const { _id } = getToken()
  const { storeId } = useParams()
  const { t } = useTranslation()

  const safeStoreId = storeId || ''
  const safeUserId = _id || ''

  const fetchStoreData = async () => {
    const storeRes = await getStoreProfile(safeUserId, safeStoreId)
    const data = storeRes.data

    if (data.error) {
      if (data.isManager === false) {
        throw new Error('REDIRECT_HOME')
      } else {
        throw new Error(data.error)
      }
    }

    const newStore = data.store

    // Fetch additional data in parallel
    const [levelRes, followerRes, deliveredRes, cancelledRes] =
      await Promise.allSettled([
        getStoreLevel(safeStoreId),
        getStoreFollowerCount(safeStoreId),
        countOrder('Delivered', '', safeStoreId),
        countOrder('Cancelled', '', safeStoreId)
      ])

    // Handle level
    newStore.level =
      levelRes.status === 'fulfilled' ? levelRes.value.data.level : {}

    // Handle followers
    newStore.numberOfFollowers =
      followerRes.status === 'fulfilled' ? followerRes.value.data.count : 0

    // Handle orders
    newStore.numberOfSuccessfulOrders =
      deliveredRes.status === 'fulfilled' ? deliveredRes.value.data.count : 0
    newStore.numberOfFailedOrders =
      cancelledRes.status === 'fulfilled' ? cancelledRes.value.data.count : 0

    actions(newStore)
    return newStore
  }

  const {
    data: storeData,
    isLoading,
    error
  } = useQuery({
    queryKey: ['store-profile', safeStoreId, safeUserId],
    queryFn: fetchStoreData,
    enabled: !store || store._id !== storeId,
    retry: (failureCount, error) => {
      return error?.message !== 'REDIRECT_HOME' && failureCount < 3
    }
  })

  // Handle redirect
  if (error?.message === 'REDIRECT_HOME') {
    return <Navigate to='/' replace />
  }

  const currentStore = storeData || store

  const menuItems = [
    {
      key: 'profile',
      icon: <ShopOutlined className='text-blue-500' />,
      label: (
        <Link to={`/seller/profile/${storeId}`} className='text-gray-700'>
          {t('storeDetail.profile')}
        </Link>
      )
    },
    {
      key: 'orders',
      icon: <FileTextOutlined className='text-blue-500' />,
      label: (
        <Link to={`/seller/orders/${storeId}`} className='text-gray-700'>
          {t('storeDetail.orders')}
        </Link>
      )
    },
    {
      type: 'divider'
    },
    {
      key: 'back',
      icon: <LeftOutlined className='text-blue-500' />,
      label: (
        <Link to='/account/store' className='text-gray-700'>
          {t('button.back')}
        </Link>
      )
    }
  ]

  return (
    <Fragment>
      {isLoading ? (
        <div className='flex justify-center items-center min-h-[200px]'>
          <Spin size='small' />
        </div>
      ) : (
        <div className='relative'>
          <Card
            className='mb-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer'
            bodyStyle={{ padding: '12px 16px' }}
          >
            <div className='flex items-center space-x-3'>
              <Avatar
                size={40}
                src={currentStore?.avatar}
                icon={<UserOutlined />}
                className='flex-shrink-0'
              />
              <div className='flex-1 min-w-0'>
                {error && error.message !== 'REDIRECT_HOME' ? (
                  <Alert
                    message={
                      error.message === 'Server Error'
                        ? 'Server Error'
                        : error.message
                    }
                    type='error'
                    showIcon
                  />
                ) : (
                  <span className='text-gray-900 font-medium truncate block'>
                    {currentStore?.name}
                  </span>
                )}
              </div>
            </div>
          </Card>

          <Card className='shadow-sm'>
            <div className='flex items-start space-x-3 p-4 border-b border-gray-100'></div>
            <Avatar
              size={35}
              src={currentStore?.avatar}
              icon={<UserOutlined />}
              className='flex-shrink-0'
            />
            <div className='flex-1 min-w-0'>
              <div className='text-blue-600 font-semibold truncate'>
                {currentStore?.name}
              </div>
              <div className='text-gray-500 text-sm truncate'>
                {currentStore?.ownerId?.email}
              </div>
            </div>

            <Menu
              items={menuItems}
              mode='vertical'
              className='border-none'
              style={{ backgroundColor: 'transparent' }}
            />
          </Card>
        </div>
      )}
    </Fragment>
  )
}

function mapStateToProps(state: any) {
  return { store: state.seller.store }
}

function mapDispatchToProps(dispatch: any) {
  return { actions: (store: any) => dispatch(addSeller(store)) }
}

export default connect(mapStateToProps, mapDispatchToProps)(SellerInit)
