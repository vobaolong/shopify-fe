import axiosClient from './client'

//user level
export const getUserLevel = async (userId: string) => {
	try {
		const res = await axiosClient.get(`/user/level/${userId}`)
		return res
	} catch (error) {
		console.log(error)
		throw error
	}
}

export const listUserLevels = async (userId: string, filter: any) => {
	const { search, sortBy, order, limit, page } = filter
	try {
		const res = await axiosClient.get(`/user/levels/${userId}`, {
			params: {
				search,
				sortBy,
				order,
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

export const createUserLevel = async (userLevel: any) => {
	try {
		const res = await axiosClient.post(`/admin/user-level`, userLevel)
		return res
	} catch (error) {
		console.log(error)
		throw error
	}
}

export const updateUserLevel = async (userLevelId: string, userLevel: any) => {
	try {
		const res = await axiosClient.put(
			`/admin/user-level/${userLevelId}`,
			userLevel
		)
		return res
	} catch (error) {
		console.log(error)
		throw error
	}
}

export const removeUserLevel = async (userLevelId: string) => {
	try {
		const res = await axiosClient.delete(`/admin/user-level/${userLevelId}`)
		return res
	} catch (error) {
		console.log(error)
		throw error
	}
}

export const restoreUserLevel = async (userLevelId: string) => {
	try {
		const res = await axiosClient.get(
			`/admin/user-level/restore/${userLevelId}`
		)
		return res
	} catch (error) {
		console.log(error)
		throw error
	}
}

//store level
export const getStoreLevel = async (storeId: string) => {
	try {
		const res = await axiosClient.get(`/store/level/${storeId}`)
		return res
	} catch (error) {
		console.log(error)
		throw error
	}
}

export const listStoreLevels = async (userId: string, filter: any) => {
	const { search, sortBy, order, limit, page } = filter
	try {
		const res = await axiosClient.get(`/store/levels/${userId}`, {
			params: {
				search,
				sortBy,
				order,
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

export const getStoreLevelById = async (userId: string, storeLevelId: string) => {
	try {
		const res = await axiosClient.get(
			`/store/level/by/id/${storeLevelId}/${userId}`
		)
		return res
	} catch (error) {
		console.log(error)
		throw error
	}
}

export const createStoreLevel = async (storeLevel: any) => {
	try {
		const res = await axiosClient.post(
			'/store/level-create',
			storeLevel
		)
		return res
	} catch (error) {
		console.log(error)
		throw error
	}
}

export const updateStoreLevel = async (storeLevelId: string, storeLevel: any) => {
	try {
		const res = await axiosClient.put(
			`/store/level/${storeLevelId}`,
			storeLevel
		)
		return res
	} catch (error) {
		console.log(error)
		throw error
	}
}

export const removeStoreLevel = async (storeLevelId: string) => {
	try {
		const res = await axiosClient.delete(
			`/store/level/${storeLevelId}`
		)
		return res
	} catch (error) {
		console.log(error)
		throw error
	}
}

export const restoreStoreLevel = async (storeLevelId: string) => {
	try {
		const res = await axiosClient.get(
			`/store/level/${storeLevelId}`
		)
		return res
	} catch (error) {
		console.log(error)
		throw error
	}
}
