/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getToken } from '../../apis/auth.api'
import {
  getStoreFollowerCount,
  checkFollowingStore
} from '../../apis/followStore.api'
import { getStoreLevel } from '../../apis/level.api'
import FollowStoreButton from '../button/FollowStoreButton'
import defaultImage from '../../assets/default.webp'
import Skeleton from 'react-loading-skeleton'
import { StoreType } from '../../@types/entity.types'

interface StoreCardSmallProps {
  isLoading?: boolean
  store: StoreType
  onRun?: (store: StoreType) => void
}

const StoreCardSmall = ({
  isLoading = false,
  store,
  onRun
}: StoreCardSmallProps) => {
  const [storeValue, setStoreValue] = useState<StoreType>(store)

  const init = async () => {
    let newStore: StoreType = { ...store }
    try {
      const data = await getStoreLevel(store._id)
      newStore.level = data.data.level
    } catch {
      console.log()
    }
    try {
      const data = await getStoreFollowerCount(store._id)
      newStore.numberOfFollowers = data.data.count
    } catch {
      newStore.numberOfFollowers = 0
    }
    try {
      const { _id } = getToken()
      const data = await checkFollowingStore(_id, store._id)
      newStore.isFollowing = data.data.success ? true : false
    } catch {
      newStore.isFollowing = false
    }
    setStoreValue(newStore)
  }

  useEffect(() => {
    if (!isLoading) {
      init()
    }
  }, [store, isLoading])

  const onHandleRun = async (newStore: StoreType) => {
    if (onRun) onRun(newStore)
    let numberOfFollowers
    try {
      const data = await getStoreFollowerCount(newStore._id)
      numberOfFollowers = data.data.count
    } catch {
      const currentNumberOfFollowers = storeValue.numberOfFollowers || 0
      numberOfFollowers = newStore.isFollowing
        ? currentNumberOfFollowers + 1
        : currentNumberOfFollowers - 1
    }
    setStoreValue({
      ...storeValue,
      numberOfFollowers
    })
  }

  return (
    <div className='card-small border-0 bg-body rounded-2 w-100'>
      {isLoading ? (
        <Skeleton height={150} />
      ) : (
        <Link
          className='text-reset text-decoration-none'
          to={`/store/${storeValue._id}`}
          title={storeValue.name}
        >
          <div className='card-img-top cus-card-img-top-small'>
            <img
              loading='lazy'
              src={storeValue.avatar || defaultImage}
              className='cus-card-img-small'
              alt={storeValue.name}
            />
          </div>
        </Link>
      )}

      <div className='card-body border-top border-value'>
        {isLoading ? (
          <Skeleton height={40} />
        ) : (
          <small className='card-subtitle'>
            <div className='d-flex justify-content-between align-items-center'>
              {getToken() && (
                <FollowStoreButton
                  storeId={store._id}
                  isFollowing={storeValue.isFollowing}
                  className='w-70'
                  onRun={(store) => onHandleRun(store as StoreType)}
                />
              )}
              <label className='btn w-25 btn-group border rounded-1 justify-content-center'>
                {storeValue.numberOfFollowers}
              </label>
            </div>
          </small>
        )}
      </div>
    </div>
  )
}

export default StoreCardSmall
