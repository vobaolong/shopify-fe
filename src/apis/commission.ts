import axiosClient from './axiosClient'

export const listActiveCommissions = async () => {
	try {
		const res = await axiosClient.get('/commission/active')
		return res
	} catch (error) {
		console.log(error)
		throw error
	}
}

export const listCommissions = async (filter: any) => {
	const { search, sortBy, order, limit, page } = filter
	try {
		const res = await axiosClient.get(`/commissions`, {
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

export const getCommissionByStore = async (storeId: string) => {
	try {
		const res = await axiosClient.get(`/store/commission/${storeId}`)
		return res
	} catch (error) {
		console.log(error)
		throw error
	}
}

export const createCommission = async (commission: any) => {
	try {
		const res = await axiosClient.post('commission', commission)
		return res
	} catch (error) {
		console.log(error)
		throw error
	}
}

export const updateCommission = async (commissionId: string, commission: any) => {
	try {
		const res = await axiosClient.put(`/commission/${commissionId}`, commission)
		return res
	} catch (error) {
		console.log(error)
		throw error
	}
}

export const removeCommission = async (commissionId: string) => {
	try {
		const res = await axiosClient.delete(`/commission/${commissionId}`)
		return res
	} catch (error) {
		console.log(error)
		throw error
	}
}

export const restoreCommission = async (commissionId: string) => {
	try {
		const res = await axiosClient.get(`/commission/${commissionId}/restore`)
		return res
	} catch (error) {
		console.log(error)
		throw error
	}
}
