import { useState } from 'react'
import { Layout } from 'antd'
import Breadcrumb, { BreadcrumbPath } from '../ui/Breadcrumb'
import MainLayout from './MainLayout'
import AccountSideBar from './menu/AccountSideBar'
import { UserType } from '../../@types/entity.types'

const { Content } = Layout

interface AccountLayoutProps {
  user?: UserType
  children: React.ReactNode
  paths: BreadcrumbPath[]
}

const AccountLayout = ({ user, children, paths }: AccountLayoutProps) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <MainLayout>
      <Layout style={{ minHeight: '100vh', background: 'transparent' }}>
        {user && (
          <AccountSideBar
            user={user}
            isCollapsed={sidebarCollapsed}
            onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          />
        )}
        <Layout>
          <Content style={{ padding: '24px', marginLeft: user ? '16px' : '0' }}>
            <Breadcrumb paths={paths} />
            {children}
          </Content>
        </Layout>
      </Layout>
    </MainLayout>
  )
}
export default AccountLayout
