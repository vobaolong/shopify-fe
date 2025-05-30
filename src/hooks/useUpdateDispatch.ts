import { useSelector, useDispatch } from 'react-redux'
import { useCallback } from 'react'
import { notification } from 'antd'
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

  const mergeUser = (oldUser: any, newUser: any) => {
    return {
      ...oldUser,
      ...Object.fromEntries(
        Object.entries(newUser).filter(([_, v]) => v !== undefined)
      )
    }
  }

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
              const res1 = await countOrder(OrderStatus.DELIVERED, _id, '')
              const res2 = await countOrder(OrderStatus.CANCELLED, _id, '')
              data.numberOfSuccessfulOrders = (res1 as any)?.count
              data.numberOfFailedOrders = (res2 as any)?.count
            } catch {
              data.numberOfSuccessfulOrders = account?.numberOfSuccessfulOrders
              data.numberOfFailedOrders = account?.numberOfFailedOrders
            }

            // Nếu data chỉ có 1-2 trường, cảnh báo dev
            const dataKeys = Object.keys(data)
            if (dataKeys.length <= 2) {
              console.warn(
                '[useUpdateDispatch] Cảnh báo: updateDispatch("account", data) chỉ nhận được',
                dataKeys,
                'Có thể gây mất thông tin user. Hãy truyền object user đầy đủ.'
              )
            }

            // Merge với user cũ để không mất trường
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
