import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Layout, Menu, Button } from 'antd'
import {
  DashboardOutlined,
  ShopOutlined,
  DropboxOutlined,
  UsergroupAddOutlined,
  ShoppingCartOutlined,
  RollbackOutlined,
  WalletOutlined,
  CommentOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined
} from '@ant-design/icons'
import { useState } from 'react'
import { StoreType, UserType } from '../../../@types/entity.types'

const { Sider } = Layout

interface SellerSideBarProps {
  user: UserType
  store: StoreType
}

const menuItems = (t: (key: string) => string, storeId: string) => [
  {
    key: storeId,
    icon: <DashboardOutlined />,
    label: (
      <Link to={`/seller/${storeId}`} className='!no-underline'>
        {t('admin.adDashboard.overview')}
      </Link>
    )
  },
  {
    key: 'profile',
    icon: <ShopOutlined />,
    label: (
      <Link to={`/seller/profile/${storeId}`} className='!no-underline'>
        {t('storeDetail.profile')}
      </Link>
    )
  },
  {
    key: 'products',
    icon: <DropboxOutlined />,
    label: (
      <Link to={`/seller/products/${storeId}`} className='!no-underline'>
        {t('storeDetail.products')}
      </Link>
    )
  },
  {
    key: 'staff',
    icon: <UsergroupAddOutlined />,
    label: (
      <Link to={`/seller/staff/${storeId}`} className='!no-underline'>
        {t('storeDetail.staff')}
      </Link>
    )
  },
  {
    key: 'orders',
    icon: <ShoppingCartOutlined />,
    label: (
      <Link to={`/seller/orders/${storeId}`} className='!no-underline'>
        {t('storeDetail.orders')}
      </Link>
    )
  },
  {
    key: 'return',
    icon: <RollbackOutlined />,
    label: (
      <Link to={`/seller/return/${storeId}`} className='!no-underline'>
        {t('storeDetail.requestReturn')}
      </Link>
    )
  },
  {
    key: 'wallet',
    icon: <WalletOutlined />,
    label: (
      <Link to={`/seller/wallet/${storeId}`} className='!no-underline'>
        {t('wallet')}
      </Link>
    )
  },
  {
    key: 'review',
    icon: <CommentOutlined />,
    label: (
      <Link to={`/seller/review/${storeId}`} className='!no-underline'>
        {t('review')}
      </Link>
    )
  }
]

const siderStyle: React.CSSProperties = {
  height: '100vh',
  position: 'sticky',
  top: 0,
  bottom: 0,
  backgroundColor: 'white'
}

const SellerSideBar = ({ user, store }: SellerSideBarProps) => {
  const { t } = useTranslation()
  const location = useLocation()
  const path = location.pathname.split('/')[2] || store._id
  const [collapsed, setCollapsed] = useState(false)

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
      trigger={null}
      breakpoint='lg'
      collapsedWidth='80'
      width={220}
      style={siderStyle}
    >
      <div className='flex items-center justify-between px-4 py-3'>
        <div className='text-xl font-bold text-primary'>
          {!collapsed && 'SELLER'}
        </div>
        <Button
          type='text'
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          className='flex items-center justify-center'
        />
      </div>
      <Menu
        mode='inline'
        selectedKeys={[path]}
        items={menuItems(t, store._id)}
        style={{ height: '100%', borderRight: 0 }}
      />
    </Sider>
  )
}

export default SellerSideBar
