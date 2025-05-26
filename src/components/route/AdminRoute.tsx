import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { getToken } from '../../apis/auth.api'
import { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

const AdminRoute = ({ children }: Props) => {
  const location = useLocation()

  if (!getToken() || getToken().role !== 'admin') {
    return <Navigate to='/' state={{ from: location }} replace />
  }

  return <>{children}</>
}

export default AdminRoute
