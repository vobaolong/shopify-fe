import axiosClient from './client'

export const getBrandById = async (userId: string, brandId: string) => {
	try {
		const res = await axiosClient.get(`/brand/by/id/${brandId}/${userId}`)
		return res
	} catch (error) {
		console.log(error)
		throw error
	}
}

export const listBrands = async (filter: any) => {
	const { search, sortBy, order, limit, page, categoryId } = filter
	try {
		const res = await axiosClient.get('/brands/', {
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

export const listActiveBrands = async (filter: any) => {
	const { search, sortBy, order, limit, page, categoryId } = filter
	try {
		const res = await axiosClient.get('/brands/active', {
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

export const listBrandByCategory = async (categoryId: string) => {
	try {
		const res = await axiosClient.get('/brands/active', {
			params: {
				categoryId
			}
		})
		return res
	} catch (error) {
		console.log(error)
		throw error
	}
}

export const createBrand = async (userId: string, brand: any) => {
	try {
		const res = await axiosClient.post(`/brand/${userId}`, brand)
		return res
	} catch (error) {
		console.log(error)
		throw error
	}
}

export const updateBrand = async (userId: string, brandId: string, brand: any) => {
	try {
		const res = await axiosClient.put(`/brand/${brandId}/${userId}`, brand)
		return res
	} catch (error) {
		console.log(error)
		throw error
	}
}

export const removeBrand = async (userId: string, brandId: string) => {
	try {
		const res = await axiosClient.delete(`/brand/${brandId}/${userId}`)
		return res
	} catch (error) {
		console.log(error)
		throw error
	}
}

export const restoreBrand = async (userId: string, brandId: string) => {
	try {
		const res = await axiosClient.get(`/brand/${brandId}/${userId}/restore`)
		return res
	} catch (error) {
		console.log(error)
		throw error
	}
}
