import axiosClient from './axiosClient'

export const getVariantById = async (userId: string, variantId: string) => {
	try {
		const res = await axiosClient.get(`/variant/by/id/${variantId}/${userId}`)
		return res
	} catch (error) {
		console.log(error)
		throw error
	}
}

export const listVariants = async (userId: string, filter: any) => {
	const { search, sortBy, order, limit, page, categoryId } = filter
	try {
		const res = await axiosClient.get(`/variants/${userId}`, {
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

export const listVariantByCategory = async (categoryId: string) => {
	try {
		const res = await axiosClient.get('/active/variants', {
			params: {
				categoryId,
				limit: 100
			}
		})
		return res
	} catch (error) {
		console.log(error)
		throw error
	}
}

export const listActiveVariants = async (filter: any) => {
	const { search, sortBy, order, limit, page, categoryId } = filter
	try {
		const res = await axiosClient.get('/active/variants', {
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

export const createVariant = async (userId: string, variant: any) => {
	try {
		const res = await axiosClient.post(`/variant/create/${userId}`, variant)
		return res
	} catch (error) {
		console.log(error)
		throw error
	}
}

export const updateVariant = async (userId: string, variantId: string, variant: any) => {
	try {
		const res = await axiosClient.put(
			`/variant/${variantId}/${userId}`,
			variant
		)
		return res
	} catch (error) {
		console.log(error)
		throw error
	}
}

export const removeVariant = async (userId: string, variantId: string) => {
	try {
		const res = await axiosClient.delete(`/variant/${variantId}/${userId}`)
		return res
	} catch (error) {
		console.log(error)
		throw error
	}
}

export const restoreVariant = async (userId: string, variantId: string) => {
	try {
		const res = await axiosClient.get(`/variant/restore/${variantId}/${userId}`)
		return res
	} catch (error) {
		console.log(error)
		throw error
	}
}

// Variant value
//variant value
export const listActiveValues = async (variantId: string) => {
	try {
		const res = await axiosClient.get(
			`/active/variant/values/by/variant/${variantId}`
		)
		return res
	} catch (error) {
		console.log(error)
		throw error
	}
}

export const listValues = async (userId: string, variantId: string) => {
	try {
		const res = await axiosClient.get(
			`/variant/values/by/variant/${variantId}/${userId}`
		)
		return res
	} catch (error) {
		console.log(error)
		throw error
	}
}

export const getValueById = async (userId: string, valueId: string) => {
	try {
		const res = await axiosClient.get(`/value/by/id/${valueId}/${userId}`)
		return res
	} catch (error) {
		console.log(error)
		throw error
	}
}

export const createValue = async (userId: string, value: any) => {
	try {
		const res = await axiosClient.post(`/value/create/${userId}`, value)
		return res
	} catch (error) {
		console.log(error)
		throw error
	}
}

export const updateValue = async (userId: string, valueId: string, value: any) => {
	try {
		const res = await axiosClient.put(`/value/${valueId}/${userId}`, value)
		return res
	} catch (error) {
		console.log(error)
		throw error
	}
}

export const removeValue = async (userId: string, valueId: string) => {
	try {
		const res = await axiosClient.delete(`/value/${valueId}/${userId}`)
		return res
	} catch (error) {
		console.log(error)
		throw error
	}
}

export const restoreValue = async (userId: string, valueId: string) => {
	try {
		const res = await axiosClient.get(`/value/restore/${valueId}/${userId}`)
		return res
	} catch (error) {
		console.log(error)
		throw error
	}
}
