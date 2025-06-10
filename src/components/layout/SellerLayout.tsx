import React, { Suspense } from 'react'
import { Layout, Spin } from 'antd'
import SellerSideBar from './menu/SellerSideBar'
import BellButton from './menu/BellButton'
import AccountInit from '../init/AccountInit'
import SellerInit from '../init/SellerInit'
import Breadcrumb, { BreadcrumbPath } from '../ui/Breadcrumb'
import { UserType, StoreType } from '../../@types/entity.types'

const { Header, Content } = Layout

interface SellerLayoutProps {
  children: React.ReactNode
  user?: UserType
  store?: StoreType
  paths?: BreadcrumbPath[]
}

const SellerLayout: React.FC<SellerLayoutProps> = ({
  children,
  user = {} as UserType,
  store = {} as StoreType,
  paths
}) => {
  return (
    <>
      <Layout style={{ minHeight: '100vh' }}>
        <SellerSideBar user={user} store={store} />
        <Layout>
          <Header className='bg-white px-6 flex justify-end items-center sticky top-0 z-50 shadow-md'>
            <div className='flex items-center gap-4'>
              <Suspense fallback={<Spin size='small' />}>
                <BellButton navFor='seller' />
              </Suspense>
              <Suspense fallback={<Spin size='small' />}>
                <SellerInit />
              </Suspense>
            </div>
          </Header>
          <Content className='m-4 min-h-screen'>
            {paths && (
              <Suspense fallback={null}>
                <Breadcrumb paths={paths} />
              </Suspense>
            )}{' '}
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
    </>
  )
}
export default SellerLayout
