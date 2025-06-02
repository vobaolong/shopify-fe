import React, { Suspense } from 'react'
import { Layout, Spin } from 'antd'
import AdminSideBar from './menu/AdminSideBar'
import BellButton from './menu/BellButton'
import AccountInit from '../init/AccountInit'
import Breadcrumb, { BreadcrumbPath } from '../ui/Breadcrumb'
import { UserType } from '../../@types/entity.types'

const { Header, Content } = Layout

interface AdminLayoutProps {
  children: React.ReactNode
  user?: UserType
  paths?: BreadcrumbPath[]
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, user, paths }) => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <AdminSideBar />
      <Layout>
        <Header className='bg-white px-6 flex justify-end items-center sticky top-0 z-50 shadow-md'>
          <div className='flex items-center gap-4'>
            <Suspense fallback={<Spin size='small' />}>
              <BellButton navFor='admin' />
            </Suspense>
            <Suspense fallback={<Spin size='small' />}>
              <AccountInit />
            </Suspense>
          </div>
        </Header>
        <Content className='m-4 min-h-screen'>
          {paths && (
            <Suspense fallback={null}>
              <Breadcrumb paths={paths} />
            </Suspense>
          )}
          <Suspense
            fallback={
              <div className='flex justify-center items-center h-64'>
                <Spin size='large' />
              </div>
            }
          >
            {children}
          </Suspense>
        </Content>
      </Layout>
    </Layout>
  )
}

export default AdminLayout
