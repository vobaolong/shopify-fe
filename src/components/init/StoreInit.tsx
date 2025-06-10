import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useDispatch } from 'react-redux'
import { getToken } from '../../apis/auth.api'
import { getStore } from '../../apis/store.api'
import { getStoreLevel } from '../../apis/level.api'
import {
  getStoreFollowerCount,
  checkFollowingStore
} from '../../apis/followStore.api'
import { Spin, Alert, Avatar } from 'antd'
import defaultImage from '../../assets/default.webp'
import { addStore } from '../../store/slices/storeSlice'

const StoreInit = () => {
  const dispatch = useDispatch()
  const queryClient = useQueryClient()
  const { _id } = getToken()
  const { storeId } = useParams()
  const safeStoreId = storeId || ''
  const safeUserId = _id || ''

  const { data, isLoading, error } = useQuery({
    queryKey: ['store-init', safeStoreId, safeUserId],
    queryFn: async () => {
      const res = await getStore(safeStoreId)
      const storeData = res.data.store
      try {
        const levelRes = await getStoreLevel(safeStoreId)
        storeData.level = levelRes.data.level || {}
      } catch {
        storeData.level = {}
      }
      try {
        const followerRes = await getStoreFollowerCount(safeStoreId)
        storeData.numberOfFollowers = followerRes.data.count || 0
      } catch {
        storeData.numberOfFollowers = 0
      }
      try {
        const followRes = await checkFollowingStore(safeUserId, safeStoreId)
        storeData.isFollowing = followRes.data.success ? true : false
      } catch {
        storeData.isFollowing = false
      }
      return storeData
    },
    enabled: !!safeStoreId,
    staleTime: 5 * 60 * 1000
  })

  useEffect(() => {
    if (data) {
      dispatch(addStore(data))
      queryClient.setQueryData(['store-init', safeStoreId, safeUserId], data)
    }
  }, [data, dispatch, queryClient, safeStoreId, safeUserId])

  if (isLoading) return <Spin size='small' />
  if (error) return <Alert message={error.message} type='error' showIcon />

  return (
    <div className='your-store-card btn btn-outline-light cus-outline ripple'>
      <Avatar src={data?.avatar || defaultImage} />
      <span className='your-store-name unselect res-hide-md'>{data?.name}</span>
    </div>
  )
}

export default StoreInit
