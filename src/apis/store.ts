import axiosClient, { axiosClientImg } from './axiosClient'

export const getStoreProfile = async (userId: string, storeId: string) => {
	try {
		return await axiosClient.get(`/store/profile/${storeId}/${userId}`)
	} catch (error) {
		console.log(error)
		throw error
	}
}

export const updateProfile = async (userId: string, store: any, storeId: string) => {
	try {
		return await axiosClient.put(`/store/${storeId}/${userId}`, store)
	} catch (error) {
		console.log(error)
		throw error
	}
}

export const getStore = async (storeId: string) => {
	try {
		return await axiosClient.get(`/store/${storeId}`)
	} catch (error) {
		console.log(error)
		throw error
	}
}

export const getListStores = async (filter: any) => {
	const { search, sortBy, sortMoreBy, order, limit, page, isActive } = filter
	try {
		return await axiosClient.get('/stores', {
			params: {
				search,
				isActive,
				sortBy,
				sortMoreBy,
				order,
				limit,
				page
			}
		})
	} catch (error) {
		console.log(error)
		throw error
	}
}

export const getStoresByUser = async (userId: string, filter: any) => {
	const { search, sortBy, order, limit, page } = filter
	try {
		return await axiosClient.get(`/stores/by/user/${userId}`, {
			params: {
				search,
				sortBy,
				order,
				limit,
				page
			}
		})
	} catch (error) {
		console.log(error)
		throw error
	}
}

export const getStoresForAdmin = async (userId: string, filter: any) => {
	const { search, sortBy, sortMoreBy, order, isActive, limit, page } = filter
	try {
		return await axiosClient.get(`/stores/for/admin/${userId}`, {
			params: {
				search,
				sortBy,
				sortMoreBy,
				isActive,
				order,
				limit,
				page
			}
		})
	} catch (error) {
		console.log(error)
		throw error
	}
}

export const createStore = async (userId: string, store: any) => {
	try {
		return await axiosClientImg.post(`/store/create/${userId}`, store)
	} catch (error) {
		console.log(error)
		throw error
	}
}

export const updateAvatar = async (userId: string, photo: any, storeId: string) => {
	try {
		return await axiosClient.put(`/store/avatar/${storeId}/${userId}`, photo, {
			headers: {
				'Content-Type': 'multipart/form-data'
			}
		})
	} catch (error) {
		console.log(error)
		throw error
	}
}

export const updateCover = async (userId: string, photo: any, storeId: string) => {
	try {
		return await axiosClientImg.put(`/store/cover/${storeId}/${userId}`, photo)
	} catch (error) {
		console.log(error)
		throw error
	}
}

export const addFeaturedImage = async (userId: string, photo: any, storeId: string) => {
	try {
		return await axiosClientImg.post(
			`/store/featured/image/${storeId}/${userId}`,
			photo
		)
	} catch (error) {
		console.log(error)
		throw error
	}
}

export const updateFeaturedImage = async (userId: string, photo: any, index: number, storeId: string) => {
	try {
		return await axiosClientImg.put(
			`/store/featured/image/${storeId}/${userId}`,
			photo,
			{
				params: { index },
			}
		)
	} catch (error) {
		console.log(error)
		throw error
	}
}

export const removeFeaturedImage = async (userId: string, index: number, storeId: string) => {
	try {
		return await axiosClient.delete(
			`/store/featured/image/${storeId}/${userId}`,
			{
				params: { index }
			}
		)
	} catch (error) {
		console.log(error)
		throw error
	}
}

export const addStaff = async (userId: string, staff: any, storeId: string) => {
	try {
		return await axiosClient.post(`/store/staff/${storeId}/${userId}`, {
			staff
		})
	} catch (error) {
		console.log(error)
		throw error
	}
}

export const deleteStaff = async (userId: string, staff: any, storeId: string) => {
	try {
		return await axiosClient.delete(
			`/store/staff/remove/${storeId}/${userId}`,
			{
				data: { staff }
			}
		)
	} catch (error) {
		console.log(error)
		throw error
	}
}

export const cancelStaff = async (userId: string, storeId: string) => {
	try {
		return await axiosClient.delete(`/store/staff/cancel/${storeId}/${userId}`)
	} catch (error) {
		console.log(error)
		throw error
	}
}

export const openStore = async (userId: string, value: any, storeId: string) => {
	try {
		return await axiosClient.put(`/store/open/${storeId}/${userId}`, value)
	} catch (error) {
		console.log(error)
		throw error
	}
}

export const activeStore = async (userId: string, value: any, storeId: string) => {
	try {
		return await axiosClient.put(`/store/active/${storeId}/${userId}`, value)
	} catch (error) {
		console.log(error)
		throw error
	}
}

export const addAddress = async (userId: string, address: any) => {
	try {
		return await axiosClient.post(`/user/address/${userId}`, address)
	} catch (error) {
		console.log(error)
		throw error
	}
}

export const updateAddress = async (userId: string, index: number, address: any) => {
	try {
		return await axiosClient.put(`/user/address/${userId}`, address, {
			params: { index }
		})
	} catch (error) {
		console.log(error)
		throw error
	}
}
