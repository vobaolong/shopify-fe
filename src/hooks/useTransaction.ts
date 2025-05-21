import { useQuery } from '@tanstack/react-query'
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
import { createMutationHook } from './useMutationFactory'

// Query keys
export const transactionKeys = {
  all: ['transactions'],
  lists: () => [...transactionKeys.all, 'list'],
  listByUser: (userId, filters) => [
    ...transactionKeys.lists(),
    'user',
    userId,
    { filters }
  ],
  listByStore: (storeId, userId, filters) => [
    ...transactionKeys.lists(),
    'store',
    storeId,
    userId,
    { filters }
  ],
  listForAdmin: (userId, filters) => [
    ...transactionKeys.lists(),
    'admin',
    userId,
    { filters }
  ],
  details: () => [...transactionKeys.all, 'detail'],
  detailByUser: (transactionId, userId) => [
    ...transactionKeys.details(),
    'user',
    transactionId,
    userId
  ],
  detailByStore: (transactionId, storeId, userId) => [
    ...transactionKeys.details(),
    'store',
    transactionId,
    storeId,
    userId
  ],
  detailForAdmin: (transactionId, userId) => [
    ...transactionKeys.details(),
    'admin',
    transactionId,
    userId
  ]
}

// List transactions by user
export const useTransactionsByUser = (userId, filters) => {
  return useQuery({
    queryKey: transactionKeys.listByUser(userId, filters),
    queryFn: () => listTransactionsByUser(userId, filters),
    enabled: !!userId
  })
}

// List transactions by store
export const useTransactionsByStore = (userId, filters, storeId) => {
  return useQuery({
    queryKey: transactionKeys.listByStore(storeId, userId, filters),
    queryFn: () => listTransactionsByStore(userId, filters, storeId),
    enabled: !!userId && !!storeId
  })
}

// List transactions for admin
export const useTransactionsForAdmin = (userId, filters) => {
  return useQuery({
    queryKey: transactionKeys.listForAdmin(userId, filters),
    queryFn: () => listTransactionsForAdmin(userId, filters),
    enabled: !!userId
  })
}

// Get transaction details by user
export const useTransactionByUser = (userId, transactionId) => {
  return useQuery({
    queryKey: transactionKeys.detailByUser(transactionId, userId),
    queryFn: () => getTransactionByUser(userId, transactionId),
    enabled: !!userId && !!transactionId
  })
}

// Get transaction details by store
export const useTransactionByStore = (
  userId,

  transactionId,
  storeId
) => {
  return useQuery({
    queryKey: transactionKeys.detailByStore(transactionId, storeId, userId),
    queryFn: () => getTransactionByStore(userId, transactionId, storeId),
    enabled: !!userId && !!transactionId && !!storeId
  })
}

// Get transaction details for admin
export const useTransactionForAdmin = (userId, transactionId) => {
  return useQuery({
    queryKey: transactionKeys.detailForAdmin(transactionId, userId),
    queryFn: () => getTransactionForAdmin(userId, transactionId),
    enabled: !!userId && !!transactionId
  })
}

// Create transaction by user
export const useCreateTransactionByUser = createMutationHook(
  ({ userId, transaction }) => createTransactionByUser(userId, transaction),
  (data) => [
    { queryKey: transactionKeys.lists() },
    { queryKey: transactionKeys.listByUser(data.user._id, {}) }
  ]
)

// Create transaction by store
export const useCreateTransactionByStore = createMutationHook(
  ({ userId, transaction, storeId }) =>
    createTransactionByStore(userId, transaction, storeId),
  (data) => [
    { queryKey: transactionKeys.lists() },
    { queryKey: transactionKeys.listByStore(data.store._id, data.user._id, {}) }
  ]
)
