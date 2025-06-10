import { useEffect, useMemo } from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Avatar, Dropdown, Spin, Alert } from 'antd'
import {
  ShopOutlined,
  FileTextOutlined,
  LeftOutlined,
  UserOutlined
} from '@ant-design/icons'
import { useDispatch, useSelector } from 'react-redux'
import { getToken } from '../../apis/auth.api'
import { getStoreProfile } from '../../apis/store.api'
import { getStoreLevel } from '../../apis/level.api'
import { getStoreFollowerCount } from '../../apis/followStore.api'
import { useTranslation } from 'react-i18next'
import { addSeller, selectSellerStore } from '../../store/slices/sellerSlice'

const SellerInit = () => {
  const dispatch = useDispatch()
  const queryClient = useQueryClient()
  const store = useSelector(selectSellerStore)
  const { _id } = getToken()
  const { storeId } = useParams()
  const { t } = useTranslation()

  const safeStoreId = storeId || ''
  const safeUserId = _id || ''

  const fetchStoreData = async () => {
    const data = await getStoreProfile(safeStoreId)
    if (data.error) {
      if (data.isManager === false) {
        throw new Error('REDIRECT_HOME')
      } else {
        throw new Error(data.error)
      }
    }
    const newStore = data.store
    const [levelRes, followerRes] = await Promise.allSettled([
      getStoreLevel(safeStoreId),
      getStoreFollowerCount(safeStoreId)
    ])
    newStore.level =
      levelRes.status === 'fulfilled' && levelRes.value?.level
        ? levelRes.value.level
        : {}
    newStore.numberOfFollowers =
      followerRes.status === 'fulfilled' && followerRes.value?.data?.count
        ? followerRes.value.data.count
        : 0
    return newStore
  }

  const {
    data: storeData,
    isLoading,
    error
  } = useQuery({
    queryKey: ['store-profile', safeStoreId, safeUserId],
    queryFn: fetchStoreData,
    enabled: !!safeStoreId,
    retry: (failureCount, error: any) => {
      return error?.message !== 'REDIRECT_HOME' && failureCount < 3
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false
  })

  useEffect(() => {
    if (storeData && Object.keys(storeData).length > 0) {
      const storeDataWithId = { ...storeData, _id: safeStoreId }
      queryClient.setQueryData(['sellerStore'], storeDataWithId)
      dispatch(addSeller(storeDataWithId))
    }
  }, [storeData, safeStoreId, queryClient, dispatch])

  const currentStore = storeData || store

  const menuItems = useMemo(
    () => [
      {
        key: 'profile',
        icon: <ShopOutlined />,
        label: (
          <Link to={`/seller/profile/${storeId}`} className='!no-underline p-2'>
            {t('storeDetail.profile')}
          </Link>
        )
      },
      {
        key: 'orders',
        icon: <FileTextOutlined />,
        label: (
          <Link to={`/seller/orders/${storeId}`} className='!no-underline p-2'>
            {t('storeDetail.orders')}
          </Link>
        )
      },
      {
        type: 'divider' as const
      },
      {
        key: 'back',
        icon: <LeftOutlined />,
        label: (
          <Link to='/account/store' className='!no-underline p-2 text-blue-600'>
            {t('button.back')}
          </Link>
        )
      }
    ],
    [storeId, t]
  )

  if (error?.message === 'REDIRECT_HOME') {
    return <Navigate to='/' replace />
  }
  if (isLoading) {
    return <Spin size='small' />
  }
  if (error) {
    return (
      <Alert message={error.message} type='error' showIcon className='mb-4' />
    )
  }

  return (
    <Dropdown
      menu={{ items: menuItems }}
      trigger={['click']}
      placement='bottomRight'
    >
      <Avatar
        className='cursor-pointer'
        src={currentStore?.avatar}
        icon={<UserOutlined />}
        size={32}
      />
    </Dropdown>
  )
}

export default SellerInit
