import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useDispatch } from 'react-redux'
import { getUserLevel } from '../../apis/level.api'
import { getUser } from '../../apis/user.api'
import { Spin, Alert, Avatar } from 'antd'
import defaultImage from '../../assets/default.webp'
import { addUser } from '../../store/slices/userSlice'

const UserInit = () => {
  const dispatch = useDispatch()
  const queryClient = useQueryClient()
  const { userId } = useParams()
  const safeUserId = userId || ''

  const { data, isLoading, error } = useQuery({
    queryKey: ['user-init', safeUserId],
    queryFn: async () => {
      const res = await getUser(safeUserId)
      const userData = res.data.user
      try {
        const levelRes = await getUserLevel(safeUserId)
        userData.level = levelRes.data.level || {}
      } catch {
        userData.level = {}
      }
      return userData
    },
    enabled: !!safeUserId,
    staleTime: 5 * 60 * 1000
  })

  useEffect(() => {
    if (data) {
      dispatch(addUser(data))
      queryClient.setQueryData(['user-init', safeUserId], data)
    }
  }, [data, dispatch, queryClient, safeUserId])

  if (isLoading) return <Spin size='small' />
  if (error) return <Alert message={error.message} type='error' showIcon />

  return (
    <div className='your-store-card btn btn-outline-light cus-outline ripple'>
      <Avatar src={data?.avatar || defaultImage} />
      <span className='your-store-name unselect'>{data?.userName}</span>
    </div>
  )
}

export default UserInit
