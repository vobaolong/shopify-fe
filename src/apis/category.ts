import axiosClient from './axiosClient'

export const getCategoryById = async (categoryId: string) => {
	try {
		const res = await axiosClient.get(`/category/${categoryId}`)
		return res
	} catch (error) {
		console.log(error)
		throw error
	}
}

export const listActiveCategories = async (filter: any) => {
	const { search, sortBy, order, limit, page, categoryId } = filter
	try {
		const res = await axiosClient.get('/categories/active', {
			params: {
				search,
				categoryId,
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

export const listCategories = async (userId: string, filter: any) => {
	const { search, sortBy, order, limit, page, categoryId } = filter
	try {
		const res = await axiosClient.get(`/categories/${userId}`, {
			params: {
				search,
				categoryId,
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

export const createCategory = async (category: any) => {
	try {
		const res = await axiosClient.post(`/category/create`, category)
		return res
	} catch (error) {
		console.log(error)
		throw error
	}
}

export const updateCategory = async (categoryId: string, category: any) => {
	try {
		const res = await axiosClient.put(`/category/${categoryId}`, category)
		return res
	} catch (error) {
		console.log(error)
		throw error
	}
}

export const removeCategory = async (categoryId: string) => {
	try {
		const res = await axiosClient.delete(`/category/${categoryId}`)
		return res
	} catch (error) {
		console.log(error)
		throw error
	}
}

export const restoreCategory = async (categoryId: string) => {
	try {
		const res = await axiosClient.get(`/category/${categoryId}/restore`)
		return res
	} catch (error) {
		console.log(error)
		throw error
	}
}
