import React, { ReactNode } from 'react'
import MainNav from './menu/MainNav'
import Footer from './menu/Footer'
import { Role } from '../../enums/OrderStatus.enum'
import { Layout } from 'antd'
import { Content } from 'antd/es/layout/layout'

interface MainLayoutProps {
  navFor?: string
  children?: ReactNode
}

const MainLayout = ({
  navFor = Role.USER,
  children = null
}: MainLayoutProps) => {
  return (
    <Layout>
      <MainNav navFor={navFor} />
      <Content className='flex justify-center min-h-screen w-full px-4'>
        <div className='w-full max-w-7xl'>{children}</div>
      </Content>
      {navFor === Role.USER && <Footer />}
    </Layout>
  )
}

export default MainLayout
