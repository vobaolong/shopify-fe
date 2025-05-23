import axiosClient from './client'

export const listReportsForAdmin = async (filter: any) => {
	const { search, sortBy, order, limit, page, isStore, isProduct, isReview } =
		filter
	try {
		const res = await axiosClient.get('/reports', {
			params: {
				search,
				sortBy,
				isStore,
				isProduct,
				isReview,
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

export const reportByUser = async (data: any) => {
	try {
		const res = await axiosClient.post('/reports', data)
		return res
	} catch (error) {
		console.error(error)
		throw error
	}
}

export const deleteReport = async (reportId: string) => {
	try {
		const res = await axiosClient.delete(`/reports/${reportId}`)
		return res
	} catch (error) {
		console.log(error)
		throw error
	}
}
