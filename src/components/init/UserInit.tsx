import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { connect } from 'react-redux'
import { Spin, Alert } from 'antd'
import { getUserLevel } from '../../apis/level.api'
import { countOrder } from '../../apis/order.api'
import { getUser } from '../../apis/user.api'
import defaultImage from '../../assets/default.webp'
import { addUser } from '../../store/slices/userSlice'

interface UserInitProps {
  user: any
  actions: (user: any) => void
}

const UserInit = ({ user, actions }: UserInitProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const { userId } = useParams()
  const [error, setError] = useState('')
  const safeUserId = userId || ''

  const init = async () => {
    setError('')
    setIsLoading(true)
    try {
      const res = await getUser(safeUserId)
      const data = res.data
      if (data.error) {
        setError(data.error)
        setIsLoading(false)
      } else {
        const newUser = data.user
        try {
          const res = await getUserLevel(safeUserId)
          newUser.level = res.data.level
        } catch {
          newUser.level = {}
        }

        try {
          const res1 = await countOrder('Delivered', safeUserId, '')
          const res2 = await countOrder('Cancelled', safeUserId, '')
          newUser.numberOfSuccessfulOrders = res1.data.count
          newUser.numberOfFailedOrders = res2.data.count
        } catch {
          newUser.numberOfSuccessfulOrders = 0
          newUser.numberOfFailedOrders = 0
        }

        actions(newUser)
        setIsLoading(false)
      }
    } catch {
      setError('Server Error')
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (!user || user._id !== userId) init()
  }, [userId])
  return isLoading ? (
    <div className='cus-position-relative-loading'>
      <Spin size='small' />
    </div>
  ) : (
    <div className='your-store-card btn btn-outline-light cus-outline ripple'>
      <img
        loading='lazy'
        src={user.avatar || defaultImage}
        className='your-store-img'
        alt='avatar'
      />{' '}
      <span className='your-store-name unselect'>
        {user.userName}
        {error && <Alert message={error} type='error' showIcon />}
      </span>
    </div>
  )
}

function mapStateToProps(state: any) {
  return { user: state.user.user }
}

function mapDispatchToProps(dispatch: any) {
  return { actions: (user: any) => dispatch(addUser(user)) }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserInit)
