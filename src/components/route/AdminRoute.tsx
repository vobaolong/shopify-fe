import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { getToken } from '../../apis/auth'

const AdminRoute = () => {
  const location = useLocation()

  if (!getToken() || getToken().role !== 'admin') {
    return <Navigate to='/' state={{ from: location }} replace />
  }

  return <Outlet />
}

export default AdminRoute
