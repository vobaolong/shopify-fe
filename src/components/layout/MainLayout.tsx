import React, { ReactNode } from 'react'
import MainNav from './menu/MainNav'
import Footer from './menu/Footer'

interface MainLayoutProps {
  container?: string
  navFor?: string
  children?: ReactNode
}

const MainLayout: React.FC<MainLayoutProps> = ({
  container = 'container-md',
  navFor = 'user',
  children = null
}) => {
  return (
    <div className='main-layout'>
      <MainNav navFor={navFor} />
      <main className={`body ${container}`}>{children}</main>
      {navFor !== 'user' ? <div className='mb-4'></div> : <Footer />}
    </div>
  )
}

export default MainLayout
