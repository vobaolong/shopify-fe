import axiosClient from './client'

export const getCartCount = async (userId: string) => {
	try {
		return await axiosClient.get(`/user/${userId}/cart/count`)
	} catch (error) {
		console.log(error)
		throw error
	}
}

export const addToCart = async (userId: string, cartItem: any) => {
	try {
		return await axiosClient.post(`/user/${userId}/cart`, cartItem)
	} catch (error) {
		console.log(error)
		throw error
	}
}

export const listCarts = async (userId: string, filter: any) => {
	const { limit, page } = filter
	try {
		return await axiosClient.get(`/user/${userId}/cart`, {
			params: { limit, page }
		})
	} catch (error) {
		return console.log(error)
	}
}

export const listItemsByCart = async (userId: string, cartId: string) => {
	try {
		return await axiosClient.get(`/user/${userId}/cart/${cartId}/items`)
	} catch (error) {
		console.log(error)
		throw error
	}
}

export const deleteFromCart = async (userId: string, cartItemId: string) => {
	try {
		return await axiosClient.delete(`/user/${userId}/cart/item/${cartItemId}`)
	} catch (error) {
		console.log(error)
		throw error
	}
}

export const updateCartItem = async (userId: string, count: number, cartItemId: string) => {
	try {
		return await axiosClient.put(
			`/user/${userId}/cart/item/${cartItemId}`,
			count
		)
	} catch (error) {
		console.log(error)
		throw error
	}
}
