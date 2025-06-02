import Breadcrumb, { BreadcrumbPath } from '../ui/Breadcrumb'
import MainLayout from './MainLayout'
import AccountSideBar from './menu/AccountSideBar'
import { UserType } from '../../@types/entity.types'

interface AccountLayoutProps {
  user?: UserType
  children: React.ReactNode
  paths: BreadcrumbPath[]
}
const AccountLayout = ({ user, children, paths }: AccountLayoutProps) => {
  return (
    <MainLayout>
      <div className='container-fluid p-0'>
        <div className='row'>
          <div className='col-lg-2 res-sticky-top-md'>
            {user && <AccountSideBar user={user} />}
          </div>
          <div className='col-lg-10 mt-4'>
            <Breadcrumb paths={paths} />
            {children}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
export default AccountLayout
