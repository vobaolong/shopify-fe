import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { getToken } from '../../apis/auth'

const PrivateRoute = () => {
  const location = useLocation()

  if (!getToken()) {
    return <Navigate to='/' state={{ from: location }} replace />
  }

  return <Outlet />
}

export default PrivateRoute
