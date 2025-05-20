import axiosClient from './axiosClient'

//user follow product
export const listFavoriteProducts = async (userId: string, filter: any) => {
	const { limit, page } = filter
	try {
		const res = await axiosClient.get(`/favorite/products/${userId}`, {
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

export const getFavoriteCount = async (productId: string) => {
	try {
		const res = await axiosClient.get(`/product/favorite-count/${productId}`)
		return res
	} catch (error) {
		console.log(error)
		throw error
	}
}

export const checkFavoriteProduct = async (userId: string, productId: string) => {
	try {
		const res = await axiosClient.get(
			`/check/favorite/products/${productId}/${userId}`
		)
		return res
	} catch (error) {
		console.log(error)
		throw error
	}
}

export const favoriteProduct = async (userId: string, productId: string) => {
	try {
		const res = await axiosClient.get(
			`/favorite/product/${productId}/${userId}`
		)
		return res
	} catch (error) {
		console.log(error)
		throw error
	}
}

export const unFavoriteProduct = async (userId: string, productId: string) => {
	try {
		const res = await axiosClient.delete(
			`/unfavorite/product/${productId}/${userId}`
		)
		return res
	} catch (error) {
		console.log(error)
		throw error
	}
}
