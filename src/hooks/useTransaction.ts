import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { notification } from 'antd'
import {
  listTransactionsByUser,
  listTransactionsByStore,
  listTransactionsForAdmin,
  getTransactionByUser,
  getTransactionByStore,
  getTransactionForAdmin,
  createTransactionByUser,
  createTransactionByStore
} from '../apis/transaction.api'

// Types
interface FiltersType {
  [key: string]: any
}

interface TransactionType {
  _id?: string
  amount?: number
  description?: string
  status?: string
  type?: string
  [key: string]: any
}

interface CreateTransactionByUserVars {
  userId: string
  transaction: TransactionType
}

interface CreateTransactionByStoreVars {
  userId: string
  transaction: TransactionType
  storeId: string
}

interface TransactionUserData {
  user: { _id: string }
}

interface TransactionStoreData {
  store: { _id: string }
  user: { _id: string }
}

interface TransactionResponse {
  data?: TransactionUserData | TransactionStoreData
  success?: boolean
  message?: string
}

/**
 * Query keys for transaction-related queries
 * Organized hierarchically for better cache management
 */
export const transactionKeys = {
  all: ['transactions'] as const,
  lists: () => [...transactionKeys.all, 'list'] as const,
  listByUser: (userId: string, filters: FiltersType) =>
    [...transactionKeys.lists(), 'user', userId, { filters }] as const,
  listByStore: (storeId: string, userId: string, filters: FiltersType) =>
    [
      ...transactionKeys.lists(),
      'store',
      storeId,
      userId,
      { filters }
    ] as const,
  listForAdmin: (filters: FiltersType) =>
    [...transactionKeys.lists(), 'admin', { filters }] as const,
  details: () => [...transactionKeys.all, 'detail'] as const,
  detailByUser: (transactionId: string, userId: string) =>
    [...transactionKeys.details(), 'user', transactionId, userId] as const,
  detailByStore: (transactionId: string, storeId: string, userId: string) =>
    [
      ...transactionKeys.details(),
      'store',
      transactionId,
      storeId,
      userId
    ] as const,
  detailForAdmin: (transactionId: string, userId: string) =>
    [...transactionKeys.details(), 'admin', transactionId, userId] as const
}

/**
 * Hook to fetch transactions by user
 * @param userId - The user ID
 * @param filters - Filter parameters for the query
 * @returns Query result with transaction data
 */
export const useTransactionsByUser = (userId: string, filters: FiltersType) => {
  const query = useQuery({
    queryKey: transactionKeys.listByUser(userId, filters),
    queryFn: () => listTransactionsByUser(userId, filters),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2
  })

  // Handle errors with notification
  if (query.error) {
    notification.error({
      message: 'Failed to Load Transactions',
      description: 'Unable to fetch user transactions. Please try again.',
      placement: 'topRight'
    })
  }

  return query
}

/**
 * Hook to fetch transactions by store
 * @param userId - The user ID
 * @param filters - Filter parameters for the query
 * @param storeId - The store ID
 * @returns Query result with transaction data
 */
export const useTransactionsByStore = (
  userId: string,
  filters: FiltersType,
  storeId: string
) => {
  const query = useQuery({
    queryKey: transactionKeys.listByStore(storeId, userId, filters),
    queryFn: () => listTransactionsByStore(userId, filters, storeId),
    enabled: !!userId && !!storeId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2
  })

  // Handle errors with notification
  if (query.error) {
    notification.error({
      message: 'Failed to Load Store Transactions',
      description: 'Unable to fetch store transactions. Please try again.',
      placement: 'topRight'
    })
  }

  return query
}

/**
 * Hook to fetch transactions for admin
 * @param userId - The user ID
 * @param filters - Filter parameters for the query
 * @returns Query result with transaction data
 */
export const useTransactionsForAdmin = (
  userId: string,
  filters: FiltersType
) => {
  const query = useQuery({
    queryKey: transactionKeys.listForAdmin(filters),
    queryFn: () => listTransactionsForAdmin(filters),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2
  })

  // Handle errors with notification
  if (query.error) {
    notification.error({
      message: 'Failed to Load Admin Transactions',
      description: 'Unable to fetch admin transactions. Please try again.',
      placement: 'topRight'
    })
  }

  return query
}

/**
 * Hook to fetch transaction details by user
 * @param userId - The user ID
 * @param transactionId - The transaction ID
 * @returns Query result with transaction detail data
 */
export const useTransactionByUser = (userId: string, transactionId: string) => {
  const query = useQuery({
    queryKey: transactionKeys.detailByUser(transactionId, userId),
    queryFn: () => getTransactionByUser(userId, transactionId),
    enabled: !!userId && !!transactionId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2
  })

  // Handle errors with notification
  if (query.error) {
    notification.error({
      message: 'Failed to Load Transaction Details',
      description: 'Unable to fetch transaction details. Please try again.',
      placement: 'topRight'
    })
  }

  return query
}

/**
 * Hook to fetch transaction details by store
 * @param userId - The user ID
 * @param transactionId - The transaction ID
 * @param storeId - The store ID
 * @returns Query result with transaction detail data
 */
export const useTransactionByStore = (
  userId: string,
  transactionId: string,
  storeId: string
) => {
  const query = useQuery({
    queryKey: transactionKeys.detailByStore(transactionId, storeId, userId),
    queryFn: () => getTransactionByStore(userId, transactionId, storeId),
    enabled: !!userId && !!transactionId && !!storeId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2
  })

  // Handle errors with notification
  if (query.error) {
    notification.error({
      message: 'Failed to Load Store Transaction Details',
      description:
        'Unable to fetch store transaction details. Please try again.',
      placement: 'topRight'
    })
  }

  return query
}

/**
 * Hook to fetch transaction details for admin
 * @param userId - The user ID
 * @param transactionId - The transaction ID
 * @returns Query result with transaction detail data
 */
export const useTransactionForAdmin = (
  userId: string,
  transactionId: string
) => {
  const query = useQuery({
    queryKey: transactionKeys.detailForAdmin(transactionId, userId),
    queryFn: () => getTransactionForAdmin(userId, transactionId),
    enabled: !!userId && !!transactionId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2
  })

  // Handle errors with notification
  if (query.error) {
    notification.error({
      message: 'Failed to Load Admin Transaction Details',
      description:
        'Unable to fetch admin transaction details. Please try again.',
      placement: 'topRight'
    })
  }

  return query
}

/**
 * Hook to create transaction by user
 * @returns Mutation hook for creating user transactions
 */
export const useCreateTransactionByUser = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ userId, transaction }: CreateTransactionByUserVars) =>
      createTransactionByUser(userId, transaction),
    onSuccess: (response: TransactionResponse) => {
      const data = response?.data as TransactionUserData
      queryClient.invalidateQueries({ queryKey: transactionKeys.lists() })
      if (data?.user?._id) {
        queryClient.invalidateQueries({
          queryKey: transactionKeys.listByUser(data.user._id, {})
        })
      }
      notification.success({
        message: 'Transaction Created',
        description: 'Transaction has been successfully created.',
        placement: 'topRight'
      })
    },
    onError: (error: any) => {
      notification.error({
        message: 'Transaction Creation Failed',
        description:
          error?.message || 'Failed to create transaction. Please try again.',
        placement: 'topRight'
      })
    }
  })
}

/**
 * Hook to create transaction by store
 * @returns Mutation hook for creating store transactions
 */
export const useCreateTransactionByStore = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      userId,
      transaction,
      storeId
    }: CreateTransactionByStoreVars) =>
      createTransactionByStore(userId, transaction, storeId),
    onSuccess: (response: TransactionResponse) => {
      const data = response?.data as TransactionStoreData
      queryClient.invalidateQueries({ queryKey: transactionKeys.lists() })
      if (data?.store?._id && data?.user?._id) {
        queryClient.invalidateQueries({
          queryKey: transactionKeys.listByStore(
            data.store._id,
            data.user._id,
            {}
          )
        })
      }
      notification.success({
        message: 'Store Transaction Created',
        description: 'Store transaction has been successfully created.',
        placement: 'topRight'
      })
    },
    onError: (error: any) => {
      notification.error({
        message: 'Store Transaction Creation Failed',
        description:
          error?.message ||
          'Failed to create store transaction. Please try again.',
        placement: 'topRight'
      })
    }
  })
}
