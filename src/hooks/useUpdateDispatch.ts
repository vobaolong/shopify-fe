/* eslint-disable default-case */
import { useSelector, useDispatch } from 'react-redux'
import { addAccount } from '../store/actions/account'
import { addSeller } from '../store/actions/seller'
import { addUser } from '../store/actions/user'
import { addStore } from '../store/actions/store'
import { addProduct } from '../store/actions/product'
import { getStoreFollowerCount, checkFollowingStore } from '../apis/followStore'
import { getUserLevel, getStoreLevel } from '../apis/level'
import { countOrder } from '../apis/order'
import { getCartCount } from '../apis/cart'
import { getToken } from '../apis/auth'

const useUpdateDispatch = () => {
	const account = useSelector((state: any) => state.account.user)
	const seller = useSelector((state: any) => state.seller.store)
	const user = useSelector((state: any) => state.user.user)
	const store = useSelector((state) => state.store.store)
	const { _id } = getToken()

	const dispatch = useDispatch()

	const updateDispatch = async (name, data) => {
		switch (name) {
			case 'account': {
				//get level
				try {
					const res = await getUserLevel(_id)
					data.level = res.level
				} catch {
					data.level = account.level
				}

				//get count carts
				try {
					const res = await getCartCount(_id)
					data.cartCount = res.count
				} catch {
					data.cartCount = account.cartCount
				}

				//get count orders
				try {
					const res1 = await countOrder('Delivered', _id, '')
					const res2 = await countOrder('Cancelled', _id, '')
					data.numberOfSuccessfulOrders = res1.count
					data.numberOfFailedOrders = res2.count
				} catch {
					data.numberOfSuccessfulOrders = account.numberOfSuccessfulOrders
					data.numberOfFailedOrders = account.numberOfFailedOrders
				}

				return dispatch(addAccount(data))
			}

			case 'seller': {
				//get level
				try {
					const res = await getStoreLevel(data._id)
					data.level = res.level
				} catch {
					data.level = seller.level
				}

				//get count followers
				try {
					const res = await getStoreFollowerCount(data._id)
					data.numberOfFollowers = res.count
				} catch {
					data.numberOfFollowers = seller.numberOfFollowers
				}

				//get count orders
				try {
					const res1 = await countOrder('Delivered', '', data._id)
					const res2 = await countOrder('Cancelled', '', data._id)
					data.numberOfSuccessfulOrders = res1.count
					data.numberOfFailedOrders = res2.count
				} catch {
					data.numberOfSuccessfulOrders = seller.numberOfSuccessfulOrders
					data.numberOfFailedOrders = seller.numberOfFailedOrders
				}

				return dispatch(addSeller(data))
			}

			case 'user': {
				//get level
				try {
					const res = await getUserLevel(data._id)
					data.level = res.level
				} catch {
					data.level = user.level
				}

				//get count orders
				try {
					const res1 = await countOrder('Delivered', data._id, '')
					const res2 = await countOrder('Cancelled', data._id, '')
					data.numberOfSuccessfulOrders = res1.count
					data.numberOfFailedOrders = res2.count
				} catch {
					data.numberOfSuccessfulOrders = user.numberOfSuccessfulOrders
					data.numberOfFailedOrders = user.numberOfFailedOrders
				}

				return dispatch(addUser(data))
			}

			case 'store': {
				//get level
				try {
					const res = await getStoreLevel(data._id)
					data.level = res.level
				} catch {
					data.level = store.level
				}

				//get count followers
				try {
					const res = await getStoreFollowerCount(data._id)
					data.numberOfFollowers = res.count
				} catch {
					if (typeof data.isFollowing === 'boolean') {
						const currentNumberOfFollowers = store.numberOfFollowers
						data.numberOfFollowers = data.isFollowing
							? currentNumberOfFollowers + 1
							: currentNumberOfFollowers - 1
					} else {
						data.isFollowing = store.isFollowing
						data.numberOfFollowers = store.numberOfFollowers
					}
				}

				//check follow
				try {
					const res = await checkFollowingStore(_id, data._id)
					data.isFollowing = res.success ? true : false
				} catch {
					if (typeof data.isFollowing === 'boolean') {
						const currentNumberOfFollowers = store.numberOfFollowers
						data.numberOfFollowers = data.isFollowing
							? currentNumberOfFollowers + 1
							: currentNumberOfFollowers - 1
					} else data.isFollowing = store.isFollowing
				}

				//get count orders
				try {
					const res1 = await countOrder('Delivered', '', data._id)
					const res2 = await countOrder('Cancelled', '', data._id)
					data.numberOfSuccessfulOrders = res1.count
					data.numberOfFailedOrders = res2.count
				} catch {
					data.numberOfSuccessfulOrders = store.numberOfSuccessfulOrders
					data.numberOfFailedOrders = store.numberOfFailedOrders
				}

				return dispatch(addStore(data))
			}

			case 'product': {
				//
				return dispatch(addProduct(data))
			}
		}
	}

	return [updateDispatch]
}

export default useUpdateDispatch
