import { useNavigate, Link } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { getToken, signout } from '../../apis/auth'
import { getUserProfile } from '../../apis/user'
import { getUserLevel } from '../../apis/level'
import { getCartCount } from '../../apis/cart'
import { countOrder } from '../../apis/order'
import { useTranslation } from 'react-i18next'
import { Avatar, Dropdown, Menu, Modal, Spin } from 'antd'
import {
  UserOutlined,
  ShopOutlined,
  ShoppingOutlined,
  LogoutOutlined
} from '@ant-design/icons'
import defaultImage from '../../assets/default.webp'
import { OrderStatus } from '../../enums/OrderStatus.enum'
import { useMemo } from 'react'

const AccountInit = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const token = getToken()
  const _id = token._id
  const refreshToken = token.refreshToken
  const role = token.role

  const { data, isLoading, error } = useQuery({
    queryKey: ['userProfile', _id],
    queryFn: async () => {
      const res = await getUserProfile(_id)
      const newUser = res.data
      // try {
      //   const levelRes = await getUserLevel(_id)
      //   newUser.level = levelRes.data.level
      // } catch {
      //   newUser.level = {}
      // }
      try {
        const cartRes = await getCartCount(_id)
        newUser.cartCount = cartRes.data.count
      } catch {
        newUser.cartCount = 0
      }
      try {
        const [deliveredRes, cancelledRes] = await Promise.all([
          countOrder(OrderStatus.DELIVERED, _id, ''),
          countOrder(OrderStatus.CANCELLED, _id, '')
        ])
        newUser.numberOfSuccessfulOrders = deliveredRes.data.count
        newUser.numberOfFailedOrders = cancelledRes.data.count
      } catch {
        newUser.numberOfSuccessfulOrders = 0
        newUser.numberOfFailedOrders = 0
      }

      return newUser
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: false
  })

  const signoutMutation = useMutation({
    mutationFn: () =>
      signout(refreshToken, () => {
        navigate(0)
      }),
    onSuccess: () => {
      navigate(0)
    }
  })

  const handleSignout = () => {
    Modal.confirm({
      title: t('button.logout'),
      content: t('confirmDialog'),
      okText: t('button.confirm'),
      cancelText: t('button.cancel'),
      onOk: () => signoutMutation.mutate()
    })
  }

  const menuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: <Link to='/account/profile'>{t('userDetail.myAccount')}</Link>
    },
    ...(role === 'user'
      ? [
          {
            key: 'store',
            icon: <ShopOutlined />,
            label: <Link to='/account/store'>{t('myStore')}</Link>
          },
          {
            key: 'purchase',
            icon: <ShoppingOutlined />,
            label: (
              <Link to='/account/purchase'>{t('userDetail.myPurchase')}</Link>
            )
          }
        ]
      : []),
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: (
        <span onClick={handleSignout} style={{ color: 'red' }}>
          {t('button.logout')}
        </span>
      )
    }
  ]

  if (isLoading) {
    return <Spin size='small' />
  }

  if (error) {
    return <div>Error: {error.message}</div>
  }

  return (
    <Dropdown
      menu={{ items: menuItems }}
      trigger={['click']}
      placement='bottomRight'
    >
      <div style={{ cursor: 'pointer' }}>
        <Avatar src={data?.avatar || defaultImage} size={32} />
        <span className='ml-0 d-none d-sm-inline' style={{ marginLeft: 8 }}>
          {t('userDetail.account')}
        </span>
      </div>
    </Dropdown>
  )
}

export default AccountInit
