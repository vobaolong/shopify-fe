import { Navigate, useLocation } from 'react-router-dom'
import { getToken } from '../../apis/auth'
import { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

const PrivateRoute = ({ children }: Props) => {
  const location = useLocation()

  if (!getToken()) {
    return <Navigate to='/' state={{ from: location }} replace />
  }

  return <>{children}</>
}

export default PrivateRoute
