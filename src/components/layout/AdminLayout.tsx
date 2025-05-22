import { useState } from 'react'
import MainLayout from './MainLayout'
import AdminSideBar from './menu/AdminSideBar'
import Breadcrumb, { BreadcrumbPath } from '../ui/Breadcrumb'
import { UserType } from '../../@types/entity.types'

interface AdminLayoutProps {
  user: UserType
  children: React.ReactNode
  paths: BreadcrumbPath[]
}

const AdminLayout = ({ children, paths }: AdminLayoutProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed)
  }

  return (
    <MainLayout container='container-xxl' navFor='admin'>
      <div className='row'>
        <div className={`col-${isCollapsed ? '1' : '2'} res-sticky-top-md p-0`}>
          <AdminSideBar />
        </div>
        <div className={`mt-4 col-${isCollapsed ? '11' : '10'}`}>
          <Breadcrumb paths={paths} />
          {children}
        </div>
      </div>
    </MainLayout>
  )
}

export default AdminLayout
