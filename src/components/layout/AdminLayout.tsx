import React from 'react'
import { Layout } from 'antd'
import AdminSideBar from './menu/AdminSideBar'
import BellButton from './menu/BellButton'
import AccountInit from '../init/AccountInit'
import Breadcrumb from '../ui/Breadcrumb'

const { Header, Content } = Layout

interface AdminLayoutProps {
  children: React.ReactNode
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <Layout>
      <AdminSideBar />
      <Layout>
        <Header className='bg-white px-6 flex justify-end items-center sticky top-0 z-50 shadow-md'>
          <div className='flex items-center gap-4'>
            <BellButton navFor='admin' />
            <AccountInit />
          </div>
        </Header>

        <Content className='m-4 min-h-screen'>{children}</Content>
      </Layout>
    </Layout>
  )
}

export default AdminLayout
