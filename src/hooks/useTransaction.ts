import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
	listTransactionsByUser,
	listTransactionsByStore,
	listTransactionsForAdmin,
	getTransactionByUser,
	getTransactionByStore,
	getTransactionForAdmin,
	createTransactionByUser,
	createTransactionByStore
} from '../apis/transaction'

type FiltersType = Record<string, any>

type TransactionType = any // Replace with your actual transaction type if available

type CreateTransactionByUserVars = { userId: string; transaction: TransactionType }
type CreateTransactionByStoreVars = { userId: string; transaction: TransactionType; storeId: string }

type TransactionUserData = { user: { _id: string } }
type TransactionStoreData = { store: { _id: string }, user: { _id: string } }

// Query keys
export const transactionKeys = {
	all: ['transactions'],
	lists: () => [...transactionKeys.all, 'list'],
	listByUser: (userId: string, filters: FiltersType) => [
		...transactionKeys.lists(),
		'user',
		userId,
		{ filters }
	],
	listByStore: (storeId: string, userId: string, filters: FiltersType) => [
		...transactionKeys.lists(),
		'store',
		storeId,
		userId,
		{ filters }
	],
	listForAdmin: (userId: string, filters: FiltersType) => [
		...transactionKeys.lists(),
		'admin',
		userId,
		{ filters }
	],
	details: () => [...transactionKeys.all, 'detail'],
	detailByUser: (transactionId: string, userId: string) => [
		...transactionKeys.details(),
		'user',
		transactionId,
		userId
	],
	detailByStore: (transactionId: string, storeId: string, userId: string) => [
		...transactionKeys.details(),
		'store',
		transactionId,
		storeId,
		userId
	],
	detailForAdmin: (transactionId: string, userId: string) => [
		...transactionKeys.details(),
		'admin',
		transactionId,
		userId
	]
}

// List transactions by user
export const useTransactionsByUser = (userId: string, filters: FiltersType) => {
	return useQuery({
		queryKey: transactionKeys.listByUser(userId, filters),
		queryFn: () => listTransactionsByUser(userId, filters),
		enabled: !!userId
	})
}

// List transactions by store
export const useTransactionsByStore = (userId: string, filters: FiltersType, storeId: string) => {
	return useQuery({
		queryKey: transactionKeys.listByStore(storeId, userId, filters),
		queryFn: () => listTransactionsByStore(userId, filters, storeId),
		enabled: !!userId && !!storeId
	})
}

// List transactions for admin
export const useTransactionsForAdmin = (userId: string, filters: FiltersType) => {
	return useQuery({
		queryKey: transactionKeys.listForAdmin(userId, filters),
		queryFn: () => listTransactionsForAdmin(userId, filters),
		enabled: !!userId
	})
}

// Get transaction details by user
export const useTransactionByUser = (userId: string, transactionId: string) => {
	return useQuery({
		queryKey: transactionKeys.detailByUser(transactionId, userId),
		queryFn: () => getTransactionByUser(userId, transactionId),
		enabled: !!userId && !!transactionId
	})
}

// Get transaction details by store
export const useTransactionByStore = (userId: string, transactionId: string, storeId: string) => {
	return useQuery({
		queryKey: transactionKeys.detailByStore(transactionId, storeId, userId),
		queryFn: () => getTransactionByStore(userId, transactionId, storeId),
		enabled: !!userId && !!transactionId && !!storeId
	})
}

// Get transaction details for admin
export const useTransactionForAdmin = (userId: string, transactionId: string) => {
	return useQuery({
		queryKey: transactionKeys.detailForAdmin(transactionId, userId),
		queryFn: () => getTransactionForAdmin(userId, transactionId),
		enabled: !!userId && !!transactionId
	})
}

// Create transaction by user
export const useCreateTransactionByUser = () => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: ({ userId, transaction }: CreateTransactionByUserVars) => createTransactionByUser(userId, transaction),
		onSuccess: (response) => {
			const data = response?.data
			queryClient.invalidateQueries({ queryKey: transactionKeys.lists() })
			if (data?.user?._id) {
				queryClient.invalidateQueries({ queryKey: transactionKeys.listByUser(data.user._id, {}) })
			}
		}
	})
}

// Create transaction by store
export const useCreateTransactionByStore = () => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: ({ userId, transaction, storeId }: CreateTransactionByStoreVars) => createTransactionByStore(userId, transaction, storeId),
		onSuccess: (response) => {
			const data = response?.data
			queryClient.invalidateQueries({ queryKey: transactionKeys.lists() })
			if (data?.store?._id && data?.user?._id) {
				queryClient.invalidateQueries({ queryKey: transactionKeys.listByStore(data.store._id, data.user._id, {}) })
			}
		}
	})
}
