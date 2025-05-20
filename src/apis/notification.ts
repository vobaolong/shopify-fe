import axiosClient from './axiosClient'

export const getNotifications = async (userId: string) => {
	try {
		const res = await axiosClient.get(`/notification/${userId}`)
		return res
	} catch (error) {
		console.log(error)
		return [
			{
				notifications: [],
				numberHidden: 0
			}
		]
	}
}

export const updateRead = async (userId: string) => {
	try {
		const res = await axiosClient.put(`/notification/${userId}`)
		return res
	} catch (error) {
		console.log(error)
		throw error
	}
}

export const sendBanStoreEmail = async (userId: string, storeId: string) => {
	try {
		const res = await axiosClient.post(`/send-ban-store/${userId}/${storeId}`)
		return res
	} catch (error) {
		console.log(error)
		throw error
	}
}

export const sendCreateStoreEmail = async (userId: string, storeId: string) => {
	try {
		const res = await axiosClient.post(`/send-create-store/${userId}/${storeId}`)
		return res
	} catch (error) {
		console.log(error)
		throw error
	}
}

export const sendActiveStoreEmail = async (userId: string, storeId: string) => {
	try {
		const res = await axiosClient.post(`/send-active-store/${userId}/${storeId}`)
		return res
	} catch (error) {
		console.log(error)
		throw error
	}
}

export const sendActiveProductEmail = async (userId: string) => {
	try {
		const res = await axiosClient.post(`/send-active-product/${userId}`)
		return res
	} catch (error) {
		console.log(error)
		throw error
	}
}

export const sendBanProductEmail = async (userId: string) => {
	try {
		const res = await axiosClient.post(`/send-ban-product/${userId}`)
		return res
	} catch (error) {
		console.log(error)
		throw error
	}
}

export const deleteNotifications = async (userId: string) => {
	try {
		const res = await axiosClient.delete(`/notification/${userId}`)
		return res
	} catch (error) {
		console.log(error)
		throw error
	}
}
