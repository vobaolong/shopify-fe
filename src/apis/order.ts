import axiosClient from './axiosClient'

export const getOrderByUser = async (userId: string, orderId: string) => {
	try {
		const res = await axiosClient.get(`/order/by/user/${orderId}/${userId}`)
		return res
	} catch (error) {
		console.log(error)
		throw error
	}
}

export const createReturnRequest = async (userId: string, orderId: string, reason: string) => {
	try {
		const res = await axiosClient.post(`/order/return/${orderId}/${userId}`, {
			reason
		})
		return res
	} catch (error) {
		console.log(error)
		throw error
	}
}

export const getOrderByStore = async (userId: string, orderId: string, storeId: string) => {
	try {
		const res = await axiosClient.get(
			`/order/by/store/${orderId}/${storeId}/${userId}`
		)
		return res
	} catch (error) {
		console.log(error)
		throw error
	}
}

export const getOrderForAdmin = async (userId: string, orderId: string) => {
	try {
		const res = await axiosClient.get(`/order/for/admin/${orderId}/${userId}`)
		return res
	} catch (error) {
		console.log(error)
		throw error
	}
}

export const createOrder = async (userId: string, cartId: string, order: any) => {
	try {
		const res = await axiosClient.post(
			`/order/create/${cartId}/${userId}`,
			order
		)
		return res
	} catch (error) {
		console.log(error)
		throw error
	}
}

export const listItemsByOrder = async (userId: string, orderId: string) => {
	try {
		const res = await axiosClient.get(
			`/order/items/by/user/${orderId}/${userId}`
		)
		return res
	} catch (error) {
		console.log(error)
		throw error
	}
}

export const listItemsByOrderByStore = async (
	userId: string,
	orderId: string,
	storeId: string
) => {
	try {
		const res = await axiosClient.get(
			`/order/items/by/store/${orderId}/${storeId}/${userId}`
		)
		return res
	} catch (error) {
		console.log(error)
		throw error
	}
}

export const listItemsByOrderForAdmin = async (userId: string, orderId: string) => {
	try {
		const res = await axiosClient.get(
			`/order/items/for/admin/${orderId}/${userId}`
		)
		return res
	} catch (error) {
		console.log(error)
		throw error
	}
}

export const listOrdersByUser = async (userId: string, filter: any) => {
	const { search, sortBy, order, limit, page, status } = filter
	try {
		const res = await axiosClient.get(`/orders/by/user/${userId}`, {
			params: {
				search,
				status,
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

export const listOrdersByStore = async (userId: string, filter: any, storeId: string) => {
	const { search, sortBy, order, limit, page, status } = filter
	try {
		const res = await axiosClient.get(`/orders/by/store/${storeId}/${userId}`, {
			params: {
				search,
				status,
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

export const listReturnByStore = async (userId: string, filter: any, storeId: string) => {
	const { search, sortBy, order, limit, page, status } = filter
	try {
		const res = await axiosClient.get(
			`/order/return/by/store/${storeId}/${userId}`,
			{
				params: {
					search,
					status,
					sortBy,
					order,
					limit,
					page
				}
			}
		)
		return res
	} catch (error) {
		console.log(error)
		throw error
	}
}

export const listOrdersForAdmin = async (userId: string, filter: any) => {
	const { search, sortBy, order, limit, page, status } = filter
	try {
		const res = await axiosClient.get(`/orders/for/admin/${userId}`, {
			params: {
				search,
				status,
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

export const userCancelOrder = async (userId: string, status: string, orderId: string) => {
	try {
		const res = await axiosClient.put(
			`/order/update/by/user/${orderId}/${userId}`,
			status
		)
		return res
	} catch (error) {
		console.log(error)
		throw error
	}
}

export const sellerUpdateStatusOrder = async (
	userId: string,
	status: string,
	orderId: string,
	storeId: string
) => {
	try {
		const res = await axiosClient.put(
			`/order/update/by/store/${orderId}/${storeId}/${userId}`,
			status
		)
		return res
	} catch (error) {
		console.log(error)
		throw error
	}
}

export const sellerUpdateReturnStatusOrder = async (
	userId: string,
	status: string,
	orderId: string,
	storeId: string
) => {
	try {
		const res = await axiosClient.post(
			`/order/return/${orderId}/${storeId}/${userId}/approve`,
			{ status }
		)
		return res
	} catch (error) {
		console.error('Error in sellerUpdateReturnStatusOrder:', error)
		throw error
	}
}

export const countOrder = async (status: string, userId: string, storeId: string) => {
	try {
		const res = await axiosClient.get('/orders/count', {
			params: {
				status,
				userId,
				storeId
			}
		})
		return res
	} catch (error) {
		console.log(error)
		throw error
	}
}
