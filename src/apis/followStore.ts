import axiosClient from './axiosClient'

//user follow store
export const listFollowingStores = async (userId: string, filter: any) => {
	const { limit, page } = filter
	try {
		const res = await axiosClient.get(`/following/stores/${userId}`, {
			params: {
				limit,
				page
			}
		})
		return res
	} catch (error) {
		console.log(error)
		throw error
	}
}

export const getStoreFollowerCount = async (storeId: string) => {
	try {
		const res = await axiosClient.get(`/store/follower-count/${storeId}`)
		return res
	} catch (error) {
		console.log(error)
		throw error
	}
}

export const checkFollowingStore = async (userId: string, storeId: string) => {
	try {
		const res = await axiosClient.get(
			`/check/following/stores/${storeId}/${userId}`
		)
		return res
	} catch (error) {
		console.log(error)
		throw error
	}
}

export const followStore = async (userId: string, storeId: string) => {
	try {
		const res = await axiosClient.get(`/follow/store/${storeId}/${userId}`)
		return res
	} catch (error) {
		console.log(error)
		throw error
	}
}

export const unfollowStore = async (userId: string, storeId: string) => {
	try {
		const res = await axiosClient.delete(`/unfollow/store/${storeId}/${userId}`)
		return res
	} catch (error) {
		console.log(error)
		throw error
	}
}
