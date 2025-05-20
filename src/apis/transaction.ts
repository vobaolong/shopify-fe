import axiosClient from './axiosClient'

export const listTransactionsByUser = async (userId: string, filter: any) => {
	const { sortBy, order, limit, page } = filter
	try {
		const res = await axiosClient.get(`/transactions/by/user/${userId}`, {
			params: {
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

export const listTransactionsByStore = async (userId: string, filter: any, storeId: string) => {
	const { sortBy, order, limit, page } = filter
	try {
		const res = await axiosClient.get(
			`/transactions/by/store/${storeId}/${userId}`,
			{
				params: {
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

export const listTransactionsForAdmin = async (userId: string, filter: any) => {
	const { sortBy, order, limit, page } = filter
	try {
		const res = await axiosClient.get(`/transactions/by/admin/${userId}`, {
			params: {
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

export const getTransactionByUser = async (userId: string, transactionId: string) => {
	try {
		const res = await axiosClient.get(
			`/transaction/by/user/${transactionId}/${userId}`
		)
		return res
	} catch (error) {
		console.log(error)
		throw error
	}
}

export const getTransactionByStore = async (userId: string, transactionId: string, storeId: string) => {
	try {
		const res = await axiosClient.get(
			`/transaction/by/store/${transactionId}/${storeId}/${userId}`
		)
		return res
	} catch (error) {
		console.log(error)
		throw error
	}
}

export const getTransactionForAdmin = async (userId: string, transactionId: string) => {
	try {
		const res = await axiosClient.get(
			`/transaction/by/admin/${transactionId}/${userId}`
		)
		return res
	} catch (error) {
		console.log(error)
		throw error
	}
}
export const createTransactionByUser = async (userId: string, transaction: any) => {
	try {
		const res = await axiosClient.post(
			`/transaction/create/by/user/${userId}`,
			transaction
		)
		return res
	} catch (error) {
		console.log(error)
		throw error
	}
}

export const createTransactionByStore = async (
	userId: string,
	transaction: any,
	storeId: string
) => {
	try {
		const res = await axiosClient.post(
			`/transaction/create/by/store/${storeId}/${userId}`,
			transaction
		)
		return res
	} catch (error) {
		console.log(error)
		throw error
	}
}
