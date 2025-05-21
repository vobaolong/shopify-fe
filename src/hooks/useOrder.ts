import { useQuery } from '@tanstack/react-query'
import {
  getOrderByUser,
  createReturnRequest,
  getOrderByStore,
  getOrderForAdmin,
  createOrder,
  listItemsByOrder,
  listItemsByOrderByStore,
  listItemsByOrderForAdmin,
  listOrdersByUser,
  listOrdersByStore,
  listReturnByStore,
  listOrdersForAdmin,
  userCancelOrder,
  sellerUpdateStatusOrder,
  sellerUpdateReturnStatusOrder,
  countOrder
} from '../apis/order'
import { createMutationHook } from './useMutationFactory'

// Query keys for orders
export const orderKeys = {
  all: ['orders'],
  lists: () => [...orderKeys.all, 'list'],
  list: (userId, filters) => [...orderKeys.lists(), userId, { filters }],
  storeList: (storeId, userId, filters) => [
    ...orderKeys.lists(),
    'store',
    storeId,
    userId,
    { filters }
  ],
  adminList: (userId, filters) => [
    ...orderKeys.lists(),
    'admin',
    userId,
    { filters }
  ],
  returnList: (storeId, userId, filters) => [
    ...orderKeys.lists(),
    'return',
    storeId,
    userId,
    { filters }
  ],
  details: () => [...orderKeys.all, 'detail'],
  detail: (orderId, userId) => [...orderKeys.details(), orderId, userId],
  storeDetail: (orderId, storeId, userId) => [
    ...orderKeys.details(),
    'store',
    orderId,
    storeId,
    userId
  ],
  adminDetail: (orderId, userId) => [
    ...orderKeys.details(),
    'admin',
    orderId,
    userId
  ],
  items: () => [...orderKeys.all, 'items'],
  itemsByOrder: (orderId, userId) => [...orderKeys.items(), orderId, userId],
  itemsByStoreOrder: (orderId, storeId, userId) => [
    ...orderKeys.items(),
    'store',
    orderId,
    storeId,
    userId
  ],
  itemsByAdminOrder: (orderId, userId) => [
    ...orderKeys.items(),
    'admin',
    orderId,
    userId
  ],
  count: (status, userId, storeId) => [
    ...orderKeys.all,
    'count',
    status,
    userId,
    storeId
  ]
}

// Order detail hooks
export const useOrderByUser = (userId, orderId) => {
  return useQuery({
    queryKey: orderKeys.detail(orderId, userId),
    queryFn: () => getOrderByUser(userId, orderId),
    enabled: !!userId && !!orderId
  })
}

export const useOrderByStore = (userId, orderId, storeId) => {
  return useQuery({
    queryKey: orderKeys.storeDetail(orderId, storeId, userId),
    queryFn: () => getOrderByStore(userId, orderId, storeId),
    enabled: !!userId && !!orderId && !!storeId
  })
}

export const useOrderForAdmin = (userId, orderId) => {
  return useQuery({
    queryKey: orderKeys.adminDetail(orderId, userId),
    queryFn: () => getOrderForAdmin(userId, orderId),
    enabled: !!userId && !!orderId
  })
}

// Order items hooks
export const useOrderItems = (userId, orderId) => {
  return useQuery({
    queryKey: orderKeys.itemsByOrder(orderId, userId),
    queryFn: () => listItemsByOrder(userId, orderId),
    enabled: !!userId && !!orderId
  })
}

export const useOrderItemsByStore = (userId, orderId, storeId) => {
  return useQuery({
    queryKey: orderKeys.itemsByStoreOrder(orderId, storeId, userId),
    queryFn: () => listItemsByOrderByStore(userId, orderId, storeId),
    enabled: !!userId && !!orderId && !!storeId
  })
}

export const useOrderItemsForAdmin = (userId, orderId) => {
  return useQuery({
    queryKey: orderKeys.itemsByAdminOrder(orderId, userId),
    queryFn: () => listItemsByOrderForAdmin(userId, orderId),
    enabled: !!userId && !!orderId
  })
}

// Order list hooks
export const useOrdersByUser = (userId, filters) => {
  return useQuery({
    queryKey: orderKeys.list(userId, filters),
    queryFn: () => listOrdersByUser(userId, filters),
    enabled: !!userId
  })
}

export const useOrdersByStore = (userId, filters, storeId) => {
  return useQuery({
    queryKey: orderKeys.storeList(storeId, userId, filters),
    queryFn: () => listOrdersByStore(userId, filters, storeId),
    enabled: !!userId && !!storeId
  })
}

export const useReturnsByStore = (userId, filters, storeId) => {
  return useQuery({
    queryKey: orderKeys.returnList(storeId, userId, filters),
    queryFn: () => listReturnByStore(userId, filters, storeId),
    enabled: !!userId && !!storeId
  })
}

export const useOrdersForAdmin = (userId, filters) => {
  return useQuery({
    queryKey: orderKeys.adminList(userId, filters),
    queryFn: () => listOrdersForAdmin(userId, filters),
    enabled: !!userId
  })
}

// Order count hook
export const useOrderCount = (status, userId, storeId) => {
  return useQuery({
    queryKey: orderKeys.count(status, userId, storeId),
    queryFn: () => countOrder(status, userId, storeId),
    enabled:
      status !== undefined && userId !== undefined && storeId !== undefined
  })
}

// Order mutations
export const useCreateOrder = createMutationHook(
  ({ userId, cartId, order }) => createOrder(userId, cartId, order),
  (data, variables) => [
    { queryKey: orderKeys.list(variables.userId) },
    { queryKey: ['cart', variables.userId] }
  ]
)

export const useCreateReturnRequest = createMutationHook(
  ({ userId, orderId, reason }) => createReturnRequest(userId, orderId, reason),
  (data, variables) => [
    { queryKey: orderKeys.detail(variables.orderId, variables.userId) },
    { queryKey: orderKeys.lists() }
  ]
)

export const useUserCancelOrder = createMutationHook(
  ({ userId, status, orderId }) => userCancelOrder(userId, status, orderId),
  (data, variables) => [
    { queryKey: orderKeys.detail(variables.orderId, variables.userId) },
    { queryKey: orderKeys.list(variables.userId) }
  ]
)

export const useSellerUpdateOrderStatus = createMutationHook(
  ({ userId, status, orderId, storeId }) =>
    sellerUpdateStatusOrder(userId, status, orderId, storeId),
  (data, variables) => [
    {
      queryKey: orderKeys.storeDetail(
        variables.orderId,
        variables.storeId,
        variables.userId
      )
    },
    { queryKey: orderKeys.storeList(variables.storeId, variables.userId) }
  ]
)

export const useSellerUpdateReturnStatus = createMutationHook(
  ({ userId, status, orderId, storeId }) =>
    sellerUpdateReturnStatusOrder(userId, status, orderId, storeId),
  (data, variables) => [
    { queryKey: orderKeys.returnList(variables.storeId, variables.userId) },
    {
      queryKey: orderKeys.storeDetail(
        variables.orderId,
        variables.storeId,
        variables.userId
      )
    }
  ]
)
