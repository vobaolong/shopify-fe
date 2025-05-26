import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { connect } from 'react-redux'
import { addStore } from '../../store/actions/store'
import { getToken } from '../../apis/auth.api'
import { getStore } from '../../apis/store.api'
import { getStoreLevel } from '../../apis/level.api'
import { countOrder } from '../../apis/order.api'
import {
  getStoreFollowerCount,
  checkFollowingStore
} from '../../apis/followStore.api'
import Error from '../ui/Error'
import Loading from '../ui/Loading'
import defaultImage from '../../assets/default.webp'

interface StoreInitProps {
  store: any
  actions: (store: any) => void
}

const StoreInit = ({ store, actions }: StoreInitProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const { _id } = getToken()
  const { storeId } = useParams()
  const safeStoreId = storeId || ''
  const safeUserId = _id || ''

  const init = () => {
    setIsLoading(true)
    getStore(safeStoreId)
      .then(async (res) => {
        const data = res.data
        if (data.error) {
          setError(data.error)
          setIsLoading(false)
        } else {
          const newStore = data.store
          try {
            const res = await getStoreLevel(safeStoreId)
            newStore.level = res.data.level
          } catch {
            newStore.level = {}
          }
          try {
            const res = await getStoreFollowerCount(safeStoreId)
            newStore.numberOfFollowers = res.data.count
          } catch {
            newStore.numberOfFollowers = 0
          }
          try {
            const res = await checkFollowingStore(safeUserId, safeStoreId)
            newStore.isFollowing = res.data.success ? true : false
          } catch {
            newStore.isFollowing = false
          }
          try {
            const res1 = await countOrder('Delivered', '', safeStoreId)
            const res2 = await countOrder('Cancelled', '', safeStoreId)
            newStore.numberOfSuccessfulOrders = res1.data.count
            newStore.numberOfFailedOrders = res2.data.count
          } catch {
            newStore.numberOfSuccessfulOrders = 0
            newStore.numberOfFailedOrders = 0
          }

          actions(newStore)
          setIsLoading(false)
        }
      })
      .catch(() => {
        setError('Server Error')
        setIsLoading(false)
      })
  }

  useEffect(() => {
    if (!store || store._id !== storeId) init()
  }, [storeId])

  return isLoading ? (
    <div className='cus-position-relative-loading'>
      <Loading size='small' />
    </div>
  ) : (
    <div className='your-store-card btn btn-outline-light cus-outline ripple'>
      <img
        loading='lazy'
        src={store.avatar || defaultImage}
        className='your-store-img'
        alt='Store avatar'
      />
      <span className='your-store-name unselect res-hide-md'>
        {store.name}
        {error && <Error msg={error} />}
      </span>
    </div>
  )
}

function mapStateToProps(state: any) {
  return { store: state.store.store }
}

function mapDispatchToProps(dispatch: any) {
  return { actions: (store: any) => dispatch(addStore(store)) }
}

export default connect(mapStateToProps, mapDispatchToProps)(StoreInit)
