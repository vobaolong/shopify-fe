import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Layout, Menu, Typography, Button, Avatar } from 'antd'
import {
  UserOutlined,
  ShoppingOutlined,
  EnvironmentOutlined,
  WalletOutlined,
  ShopOutlined,
  HeartOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  AppstoreOutlined
} from '@ant-design/icons'
import { UserType } from '../../../@types/entity.types'

const { Sider } = Layout
const { Text } = Typography

interface AccountSideBarProps {
  user?: UserType
  isCollapsed?: boolean
  onToggle?: () => void
}

const AccountSideBar = ({
  user,
  isCollapsed = false,
  onToggle
}: AccountSideBarProps) => {
  const { t } = useTranslation()
  const location = useLocation()
  const path = location.pathname.split('/')[2]
  const subPath = location.pathname.split('/')[3]

  const menuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: (
        <Link to='/account/profile' className='!no-underline'>
          {t('userDetail.myAccount')}
        </Link>
      )
    },
    {
      key: 'order',
      icon: <ShoppingOutlined />,
      label: (
        <Link to='/account/order' className='!no-underline'>
          {t('userDetail.myPurchase')}
        </Link>
      )
    },
    {
      key: 'addresses',
      icon: <EnvironmentOutlined />,
      label: (
        <Link to='/account/addresses' className='!no-underline'>
          {t('userDetail.address')}
        </Link>
      )
    },
    {
      key: 'wallet',
      icon: <WalletOutlined />,
      label: (
        <Link to='/account/wallet' className='!no-underline'>
          {t('wallet')}
        </Link>
      )
    },
    {
      key: 'store',
      icon: <ShopOutlined />,
      label: (
        <Link to='/account/store' className='!no-underline'>
          {t('manageStore')}
        </Link>
      )
    },
    {
      key: 'following',
      icon: <HeartOutlined />,
      label: t('favorite'),
      children: [
        {
          key: 'wishlist',
          icon: <AppstoreOutlined />,
          label: (
            <Link to='/account/wishlist' className='!no-underline'>
              {t('favProduct')}
            </Link>
          )
        },
        {
          key: 'following-shop',
          icon: <ShopOutlined />,
          label: (
            <Link to='/account/following-shop' className='!no-underline'>
              {t('favStore')}
            </Link>
          )
        }
      ]
    }
  ]
  // Handle current path selection logic
  let selectedKey = path

  // Special case for our new routes
  if (path === 'wishlist') {
    selectedKey = 'wishlist'
  } else if (path === 'following-shop') {
    selectedKey = 'following-shop'
  }

  const selectedKeys = [selectedKey]

  if (!user) return null

  return (
    <Sider
      collapsible
      collapsed={isCollapsed}
      onCollapse={onToggle}
      width={240}
      collapsedWidth={60}
      trigger={null}
      className='bg-white rounded-lg shadow-md overflow-hidden h-screen sticky top-0'
    >
      {!isCollapsed && (
        <div className='p-3 border-b border-gray-100'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <Avatar src={user.avatar} />
              <Text className='text-sm font-medium'>{user.userName}</Text>
            </div>
            <Button
              type='text'
              icon={<MenuFoldOutlined />}
              onClick={onToggle}
              size='small'
              className='hover:bg-blue-50 hover:text-blue-600 border-none shadow-none'
            />
          </div>
        </div>
      )}
      {isCollapsed && (
        <div className='p-3 border-b border-gray-100'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <Button
                type='text'
                icon={<MenuUnfoldOutlined />}
                onClick={onToggle}
                size='small'
                className='hover:bg-blue-50 hover:text-blue-600 border-none shadow-none'
              />
            </div>
          </div>
        </div>
      )}
      <Menu mode='inline' selectedKeys={selectedKeys} items={menuItems} />
    </Sider>
  )
}

export default AccountSideBar
