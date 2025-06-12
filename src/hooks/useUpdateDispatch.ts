import { useSelector, useDispatch } from 'react-redux'
import { useCallback } from 'react'
import { useAntdApp } from './useAntdApp'
import { addAccount } from '../store/slices/accountSlice'
import { addSeller } from '../store/slices/sellerSlice'
import { addUser } from '../store/slices/userSlice'
import { addStore } from '../store/slices/storeSlice'
import { addProduct } from '../store/slices/productSlice'
import {
  getStoreFollowerCount,
  checkFollowingStore
} from '../apis/followStore.api'
import { getUserLevel, getStoreLevel } from '../apis/level.api'
import { countOrder } from '../apis/order.api'
import { getCartCount } from '../apis/cart.api'
import { getToken } from '../apis/auth.api'
import { OrderStatus } from '../enums/OrderStatus.enum'

// Types for Redux state
export interface RootState {
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
  numberOfFollowers?: number
  isFollowing?: boolean
  [key: string]: any
}

const useUpdateDispatch = (): [
  (name: DispatchType, data: UpdateDispatchData) => Promise<void>
] => {
  const account = useSelector((state: RootState) => state.account.user)
  const seller = useSelector((state: RootState) => state.seller.store)
  const user = useSelector((state: RootState) => state.user.user)
  const store = useSelector((state: RootState) => state.store.store)
  const { _id } = getToken() || { _id: '' }

  const dispatch = useDispatch()
  const { notification } = useAntdApp()

  const mergeUser = useCallback((oldUser: any, newUser: any) => {
    return {
      ...oldUser,
      ...Object.fromEntries(
        Object.entries(newUser).filter(([_, v]) => v !== undefined)
      )
    }
  }, [])

  const updateDispatch = useCallback(
    async (name: DispatchType, data: UpdateDispatchData): Promise<void> => {
      try {
        switch (name) {
          case 'account': {
            // Batch API calls để giảm số lượng requests
            const promises = []

            // Get level
            if (!data.level) {
              promises.push(
                getUserLevel(_id).catch(() => ({ level: account?.level }))
              )
            }

            // Get count carts
            if (data.cartCount === undefined) {
              promises.push(
                getCartCount(_id).catch(() => ({ count: account?.cartCount }))
              )
            }

            // Await all promises concurrently
            const results = await Promise.allSettled(promises)

            if (results[0]?.status === 'fulfilled') {
              data.level =
                (results[0].value as any)?.level ||
                (results[0].value as any)?.data?.level
            }
            if (results[1]?.status === 'fulfilled') {
              data.cartCount = (results[1].value as any)?.count
            }

            const dataKeys = Object.keys(data)
            if (dataKeys.length <= 2) {
              console.warn(dataKeys)
            }

            const mergedUser = mergeUser(account, data)
            dispatch(addAccount(mergedUser))
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

            const mergedSeller = mergeUser(seller, data)
            dispatch(addSeller(mergedSeller))
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
            const mergedUser = mergeUser(user, data)
            dispatch(addUser(mergedUser))
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
            const mergedStore = mergeUser(store, data)
            dispatch(addStore(mergedStore))
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
