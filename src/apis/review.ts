import axiosClient from './axiosClient'

export const listReviews = async (filter: any) => {
	const { productId, storeId, userId, rating, sortBy, order, limit, page } =
		filter

	try {
		const res = await axiosClient.get('/reviews', {
			params: {
				productId,
				storeId,
				userId,
				rating,
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

export const checkReview = async (userId: string, data: any) => {
	try {
		const res = await axiosClient.post(`/review/check/${userId}`, data)
		return res
	} catch (error) {
		console.log(error)
		throw error
	}
}

export const reviewProduct = async (userId: string, review: any) => {
	try {
		const res = await axiosClient.post(`/review/create/${userId}`, review)
		return res
	} catch (error) {
		console.log(error)
		throw error
	}
}

export const updateReview = async (userId: string, review: any, reviewId: string) => {
	try {
		const res = await axiosClient.put(`/review/${reviewId}/${userId}`, review)
		return res
	} catch (error) {
		console.log(error)
		throw error
	}
}

export const deleteReview = async (userId: string, reviewId: string) => {
	try {
		const res = await axiosClient.delete(`/review/${reviewId}/${userId}`)
		return res
	} catch (error) {
		console.log(error)
		throw error
	}
}

export const restoreReview = async (userId: string, reviewId: string) => {
	try {
		const res = await axiosClient.get(`/review/restore/${reviewId}/${userId}`)
		return res
	} catch (error) {
		console.log(error)
		throw error
	}
}
