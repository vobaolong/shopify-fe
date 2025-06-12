import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { getToken } from '../../apis/auth.api'
import { useQuery } from '@tanstack/react-query'
import {
  getStoreFollowerCount,
  checkFollowingStore
} from '../../apis/followStore.api'
import { getStoreLevel } from '../../apis/level.api'
import StoreFollowLabel from '../label/StoreFollowLabel'
import StarRating from '../label/StarRating'
import FollowStoreButton from '../button/FollowStoreButton'
import { Card, Skeleton, Typography, Space, Avatar, Rate } from 'antd'
import { StoreType } from '../../@types/entity.types'

const { Text, Title } = Typography

interface StoreCardProps {
  store: StoreType
  onRun?: (store: StoreType) => void
}

const StoreCard = ({ store, onRun }: StoreCardProps) => {
  const [storeValue, setStoreValue] = useState<StoreType>(store)
  const isMounted = useRef(true)

  // Use TanStack Query for data fetching
  const { data: levelData, isLoading: isLevelLoading } = useQuery({
    queryKey: ['storeLevel', store._id],
    queryFn: () => getStoreLevel(store._id),
    enabled: !!store._id
  })

  const { data: followersData, isLoading: isFollowersLoading } = useQuery({
    queryKey: ['storeFollowers', store._id],
    queryFn: () => getStoreFollowerCount(store._id),
    enabled: !!store._id
  })

  const { data: followingData, isLoading: isFollowingLoading } = useQuery({
    queryKey: ['storeFollowing', store._id],
    queryFn: async () => {
      try {
        const { _id } = getToken()
        return await checkFollowingStore(_id, store._id)
      } catch (error) {
        console.log(error)
        return { data: { success: false } }
      }
    },
    enabled: !!store._id
  })

  const isLoading = isLevelLoading || isFollowersLoading || isFollowingLoading

  useEffect(() => {
    isMounted.current = true
    return () => {
      isMounted.current = false
    }
  }, [])

  useEffect(() => {
    if (!isLoading && isMounted.current) {
      const newStore: StoreType = {
        ...store,
        level: levelData?.data?.level || 0,
        numberOfFollowers: followersData?.data?.count || 0,
        isFollowing: followingData?.data?.success || false
      }
      setStoreValue(newStore)
    }
  }, [store, levelData, followersData, followingData, isLoading])

  return (
    <Card
      className='card mb-3 border-0 shadow-sm'
      hoverable
      bodyStyle={{ padding: '0.75rem' }}
    >
      <div className='row g-0'>
        <div className='col-md-4 flex items-center justify-content-center'>
          {isLoading ? (
            <Skeleton.Avatar active size={100} shape='square' />
          ) : (
            <Link to={`/store/${storeValue._id}`}>
              <img
                loading='eager'
                src={storeValue.avatar}
                className='card-img'
                width='100'
                height='100'
                alt={storeValue.name}
              />
            </Link>
          )}
        </div>

        <div className='col-md-8'>
          <div className='card-body'>
            {isLoading ? (
              <>
                <Skeleton.Input style={{ width: 200 }} active />
                <Skeleton.Input style={{ width: 150, marginTop: 8 }} active />
                <Skeleton.Input style={{ width: 100, marginTop: 8 }} active />
              </>
            ) : (
              <>
                <Link to={`/store/${storeValue._id}`}>
                  <Title level={5} className='card-title text-truncate'>
                    {storeValue.name}
                  </Title>
                </Link>

                <Space
                  direction='vertical'
                  size='small'
                  style={{ width: '100%' }}
                >
                  <div className='flex'>
                    <StarRating stars={storeValue.rating || 0} />
                    <span className='card-text rating-text ms-2'>
                      {storeValue.rating ? storeValue.rating.toFixed(1) : 0}
                    </span>
                    <i className='bi bi-circle-fill px-1 pt-1 fs-8' />
                    <span>{storeValue.numberOfFollowers || 0} followers</span>
                  </div>

                  <div className='flex gap-2 items-center'>
                    <StoreFollowLabel
                      numberOfFollowers={storeValue.numberOfFollowers || 0}
                    />
                    <FollowStoreButton
                      storeId={storeValue._id}
                      isFollowing={storeValue.isFollowing}
                      onRun={
                        onRun
                          ? (data) => onRun({ ...storeValue, ...data })
                          : undefined
                      }
                    />
                  </div>
                </Space>
              </>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}

export default StoreCard
