import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Layout, Menu, Button } from 'antd'
import {
  DashboardOutlined,
  UsergroupAddOutlined,
  ShopOutlined,
  ShoppingCartOutlined,
  TransactionOutlined,
  AppstoreOutlined,
  BgColorsOutlined,
  DropboxOutlined,
  SafetyCertificateOutlined,
  PercentageOutlined,
  WarningOutlined,
  CommentOutlined,
  FontColorsOutlined,
  UserOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined
} from '@ant-design/icons'
import { useState } from 'react'

const { Sider } = Layout

const menuItems = (t: (key: string) => string) => [
  {
    key: 'dashboard',
    icon: <DashboardOutlined />,
    label: (
      <Link to='/admin/dashboard' className='!no-underline'>
        {t('admin.adDashboard.dashboard')}
      </Link>
    )
  },
  {
    key: 'users',
    icon: <UsergroupAddOutlined />,
    label: (
      <Link to='/admin/users' className='!no-underline'>
        {t('admin.users')}
      </Link>
    )
  },
  {
    key: 'stores',
    icon: <ShopOutlined />,
    label: (
      <Link to='/admin/stores' className='!no-underline'>
        {t('admin.stores')}
      </Link>
    )
  },
  {
    key: 'orders',
    icon: <ShoppingCartOutlined />,
    label: (
      <Link to='/admin/orders' className='!no-underline'>
        {t('admin.orders')}
      </Link>
    )
  },
  {
    key: 'transactions',
    icon: <TransactionOutlined />,
    label: (
      <Link to='/admin/transactions' className='!no-underline'>
        {t('admin.transactions')}
      </Link>
    )
  },
  {
    key: 'categories',
    icon: <AppstoreOutlined />,
    label: (
      <Link to='/admin/categories' className='!no-underline'>
        {t('admin.categories')}
      </Link>
    )
  },
  {
    key: 'variants',
    icon: <BgColorsOutlined />,
    label: (
      <Link to='/admin/variants' className='!no-underline'>
        {t('admin.variants')}
      </Link>
    )
  },
  {
    key: 'products',
    icon: <DropboxOutlined />,
    label: (
      <Link to='/admin/products' className='!no-underline'>
        {t('admin.products')}
      </Link>
    )
  },
  {
    key: 'levels',
    icon: <SafetyCertificateOutlined />,
    label: (
      <Link to='/admin/levels' className='!no-underline'>
        {t('admin.levels')}
      </Link>
    )
  },
  {
    key: 'commissions',
    icon: <PercentageOutlined />,
    label: (
      <Link to='/admin/commissions' className='!no-underline'>
        {t('admin.commissions')}
      </Link>
    )
  },
  {
    key: 'reports',
    icon: <WarningOutlined />,
    label: (
      <Link to='/admin/reports' className='!no-underline'>
        {t('admin.reports')}
      </Link>
    )
  },
  {
    key: 'reviews',
    icon: <CommentOutlined />,
    label: (
      <Link to='/admin/reviews' className='!no-underline'>
        {t('admin.reviews')}
      </Link>
    )
  },
  {
    key: 'brands',
    icon: <FontColorsOutlined />,
    label: (
      <Link to='/admin/brands' className='!no-underline'>
        {t('admin.brands')}
      </Link>
    )
  },
  {
    key: 'profile',
    icon: <UserOutlined />,
    label: (
      <Link to='/admin/profile' className='!no-underline'>
        {t('admin.profile')}
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
const AdminSideBar = () => {
  const { t } = useTranslation()
  const location = useLocation()
  const path = location.pathname.split('/')[2] || 'dashboard'
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
          {!collapsed && 'ADMIN'}
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
        items={menuItems(t)}
        style={{ height: '100%', borderRight: 0 }}
      />
    </Sider>
  )
}

export default AdminSideBar
