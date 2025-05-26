/* eslint-disable default-case */
import { useSelector, useDispatch } from 'react-redux'
import { useCallback } from 'react'
import { notification } from 'antd'
import { addAccount } from '../store/actions/account'
import { addSeller } from '../store/actions/seller'
import { addUser } from '../store/actions/user'
import { addStore } from '../store/actions/store'
import { addProduct } from '../store/actions/product'
import {
  getStoreFollowerCount,
  checkFollowingStore
} from '../apis/followStore.api'
import { getUserLevel, getStoreLevel } from '../apis/level.api'
import { countOrder } from '../apis/order.api'
import { getCartCount } from '../apis/cart.api'
import { getToken } from '../apis/auth.api'

// Types for Redux state
interface RootState {
  account: { user: any }
  seller: { store: any }
  user: { user: any }
  store: { store: any }
}

// Types for update dispatch
type DispatchType = 'account' | 'seller' | 'user' | 'store' | 'product'

interface UpdateDispatchData {
  _id?: string
  level?: any
  cartCount?: number
  numberOfSuccessfulOrders?: number
  numberOfFailedOrders?: number
  numberOfFollowers?: number
  isFollowing?: boolean
  [key: string]: any
}

/**
 * Custom hook for updating various dispatch actions with enriched data
 * Uses Ant Design notifications for error handling and modern async patterns
 * @returns Array containing the updateDispatch function
 */
const useUpdateDispatch = (): [
  (name: DispatchType, data: UpdateDispatchData) => Promise<void>
] => {
  const account = useSelector((state: RootState) => state.account.user)
  const seller = useSelector((state: RootState) => state.seller.store)
  const user = useSelector((state: RootState) => state.user.user)
  const store = useSelector((state: RootState) => state.store.store)
  const { _id } = getToken() || { _id: '' }

  const dispatch = useDispatch()

  const updateDispatch = useCallback(
    async (name: DispatchType, data: UpdateDispatchData): Promise<void> => {
      try {
        switch (name) {
          case 'account': {
            // Get level
            try {
              const res = await getUserLevel(_id)
              data.level = (res as any)?.level
            } catch {
              data.level = account?.level
            }

            // Get count carts
            try {
              const res = await getCartCount(_id)
              data.cartCount = (res as any)?.count
            } catch {
              data.cartCount = account?.cartCount
            }

            // Get count orders
            try {
              const res1 = await countOrder('Delivered', _id, '')
              const res2 = await countOrder('Cancelled', _id, '')
              data.numberOfSuccessfulOrders = (res1 as any)?.count
              data.numberOfFailedOrders = (res2 as any)?.count
            } catch {
              data.numberOfSuccessfulOrders = account?.numberOfSuccessfulOrders
              data.numberOfFailedOrders = account?.numberOfFailedOrders
            }

            dispatch(addAccount(data))
            break
          }

          case 'seller': {
            // Get level
            try {
              const res = await getStoreLevel(data._id!)
              data.level = (res as any)?.level
            } catch {
              data.level = seller?.level
            }

            // Get count followers
            try {
              const res = await getStoreFollowerCount(data._id!)
              data.numberOfFollowers = (res as any)?.count
            } catch {
              data.numberOfFollowers = seller?.numberOfFollowers
            }

            // Get count orders
            try {
              const res1 = await countOrder('Delivered', '', data._id!)
              const res2 = await countOrder('Cancelled', '', data._id!)
              data.numberOfSuccessfulOrders = (res1 as any)?.count
              data.numberOfFailedOrders = (res2 as any)?.count
            } catch {
              data.numberOfSuccessfulOrders = seller?.numberOfSuccessfulOrders
              data.numberOfFailedOrders = seller?.numberOfFailedOrders
            }

            dispatch(addSeller(data))
            break
          }

          case 'user': {
            // Get level
            try {
              const res = await getUserLevel(data._id!)
              data.level = (res as any)?.level
            } catch {
              data.level = user?.level
            }

            // Get count orders
            try {
              const res1 = await countOrder('Delivered', data._id!, '')
              const res2 = await countOrder('Cancelled', data._id!, '')
              data.numberOfSuccessfulOrders = (res1 as any)?.count
              data.numberOfFailedOrders = (res2 as any)?.count
            } catch {
              data.numberOfSuccessfulOrders = user?.numberOfSuccessfulOrders
              data.numberOfFailedOrders = user?.numberOfFailedOrders
            }

            dispatch(addUser(data))
            break
          }

          case 'store': {
            // Get level
            try {
              const res = await getStoreLevel(data._id!)
              data.level = (res as any)?.level
            } catch {
              data.level = store?.level
            }

            // Get count followers
            try {
              const res = await getStoreFollowerCount(data._id!)
              data.numberOfFollowers = (res as any)?.count
            } catch {
              if (typeof data.isFollowing === 'boolean') {
                const currentNumberOfFollowers = store?.numberOfFollowers || 0
                data.numberOfFollowers = data.isFollowing
                  ? currentNumberOfFollowers + 1
                  : currentNumberOfFollowers - 1
              } else {
                data.isFollowing = store?.isFollowing
                data.numberOfFollowers = store?.numberOfFollowers
              }
            }

            // Check follow
            try {
              const res = await checkFollowingStore(_id, data._id!)
              data.isFollowing = (res as any)?.success ? true : false
            } catch {
              if (typeof data.isFollowing === 'boolean') {
                const currentNumberOfFollowers = store?.numberOfFollowers || 0
                data.numberOfFollowers = data.isFollowing
                  ? currentNumberOfFollowers + 1
                  : currentNumberOfFollowers - 1
              } else {
                data.isFollowing = store?.isFollowing
              }
            }

            // Get count orders
            try {
              const res1 = await countOrder('Delivered', '', data._id!)
              const res2 = await countOrder('Cancelled', '', data._id!)
              data.numberOfSuccessfulOrders = (res1 as any)?.count
              data.numberOfFailedOrders = (res2 as any)?.count
            } catch {
              data.numberOfSuccessfulOrders = store?.numberOfSuccessfulOrders
              data.numberOfFailedOrders = store?.numberOfFailedOrders
            }

            dispatch(addStore(data))
            break
          }

          case 'product': {
            dispatch(addProduct(data))
            break
          }
        }
      } catch (error) {
        notification.error({
          message: 'Update Error',
          description: `Failed to update ${name} data. Please try again.`,
          placement: 'topRight'
        })
        console.error(`Error updating ${name}:`, error)
      }
    },
    [_id, account, seller, user, store, dispatch]
  )

  return [updateDispatch]
}

export default useUpdateDispatch
