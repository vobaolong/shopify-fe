import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
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
} from '../apis/order.api'

type FiltersType = Record<string, any>

// Query keys for orders
export const orderKeys = {
  all: ['orders'],
  lists: () => [...orderKeys.all, 'list'],
  list: (userId: string, filters: FiltersType) => [
    ...orderKeys.lists(),
    userId,
    { filters }
  ],
  storeList: (storeId: string, userId: string, filters: FiltersType) => [
    ...orderKeys.lists(),
    'store',
    storeId,
    userId,
    { filters }
  ],
  adminList: (filters: FiltersType) => [
    ...orderKeys.lists(),
    'admin',
    { filters }
  ],
  returnList: (storeId: string, userId: string, filters: FiltersType) => [
    ...orderKeys.lists(),
    'return',
    storeId,
    userId,
    { filters }
  ],
  details: () => [...orderKeys.all, 'detail'],
  detail: (orderId: string, userId: string) => [
    ...orderKeys.details(),
    orderId,
    userId
  ],
  storeDetail: (orderId: string, storeId: string, userId: string) => [
    ...orderKeys.details(),
    'store',
    orderId,
    storeId,
    userId
  ],
  adminDetail: (orderId: string, userId: string) => [
    ...orderKeys.details(),
    'admin',
    orderId,
    userId
  ],
  items: () => [...orderKeys.all, 'items'],
  itemsByOrder: (orderId: string, userId: string) => [
    ...orderKeys.items(),
    orderId,
    userId
  ],
  itemsByStoreOrder: (orderId: string, storeId: string, userId: string) => [
    ...orderKeys.items(),
    'store',
    orderId,
    storeId,
    userId
  ],
  itemsByAdminOrder: (orderId: string, userId: string) => [
    ...orderKeys.items(),
    'admin',
    orderId,
    userId
  ],
  count: (status: string, userId: string, storeId: string) => [
    ...orderKeys.all,
    'count',
    status,
    userId,
    storeId
  ]
}

export const useOrderByUser = (userId: string, orderId: string) => {
  return useQuery({
    queryKey: orderKeys.detail(orderId, userId),
    queryFn: () => getOrderByUser(userId, orderId),
    enabled: !!userId && !!orderId
  })
}

export const useOrderByStore = (orderId: string, storeId: string) => {
  return useQuery({
    queryKey: orderKeys.storeDetail(orderId, storeId, ''),
    queryFn: () => getOrderByStore(orderId, storeId),
    enabled: !!orderId && !!storeId
  })
}

export const useOrderForAdmin = (userId: string, orderId: string) => {
  return useQuery({
    queryKey: orderKeys.adminDetail(orderId, userId),
    queryFn: () => getOrderForAdmin(orderId),
    enabled: !!orderId
  })
}

export const useOrderItems = (userId: string, orderId: string) => {
  return useQuery({
    queryKey: orderKeys.itemsByOrder(orderId, userId),
    queryFn: () => listItemsByOrder(userId, orderId),
    enabled: !!userId && !!orderId
  })
}

export const useOrderItemsByStore = (
  userId: string,
  orderId: string,
  storeId: string
) => {
  return useQuery({
    queryKey: orderKeys.itemsByStoreOrder(orderId, storeId, userId),
    queryFn: () => listItemsByOrderByStore(userId, orderId, storeId),
    enabled: !!userId && !!orderId && !!storeId
  })
}

export const useOrderItemsForAdmin = (userId: string, orderId: string) => {
  return useQuery({
    queryKey: orderKeys.itemsByAdminOrder(orderId, userId),
    queryFn: () => listItemsByOrderForAdmin(orderId),
    enabled: !!orderId
  })
}

export const useOrdersByUser = (userId: string, filters: FiltersType) => {
  return useQuery({
    queryKey: orderKeys.list(userId, filters),
    queryFn: () => listOrdersByUser(userId, filters),
    enabled: !!userId
  })
}

export const useOrdersByStore = (storeId: string, filters: FiltersType) => {
  return useQuery({
    queryKey: orderKeys.storeList(storeId, '', filters),
    queryFn: () => listOrdersByStore(storeId, filters),
    enabled: !!storeId
  })
}

export const useReturnsByStore = (
  userId: string,
  filters: FiltersType,
  storeId: string
) => {
  return useQuery({
    queryKey: orderKeys.returnList(storeId, userId, filters),
    queryFn: () => listReturnByStore(userId, filters, storeId),
    enabled: !!userId && !!storeId
  })
}

export const useOrdersForAdmin = (
  filters: FiltersType,
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: orderKeys.adminList(filters),
    queryFn: async () => {
      const response = await listOrdersForAdmin(filters)
      return response.data || response
    },
    enabled: options?.enabled !== false
  })
}

export const useOrdersForStore = (
  storeId: string,
  filters: FiltersType,
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: ['orders', 'store', storeId, filters],
    queryFn: async () => {
      const response = await listOrdersByStore(storeId, filters)
      return response.data || response
    },
    enabled: options?.enabled !== false && !!storeId
  })
}

export const useOrderCount = (
  status: string,
  userId: string,
  storeId: string
) => {
  return useQuery({
    queryKey: orderKeys.count(status, userId, storeId),
    queryFn: () => countOrder(status, userId, storeId),
    enabled: !!userId && !!storeId
  })
}

export const useCreateOrder = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      userId,
      cartId,
      order
    }: {
      userId: string
      cartId: string
      order: any
    }) => createOrder(userId, cartId, order),
    onSuccess: (
      data: any,
      variables: { userId: string; cartId: string; order: any }
    ) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() })
    }
  })
}

export const useCreateReturnRequest = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      userId,
      orderId,
      reason
    }: {
      userId: string
      orderId: string
      reason: string
    }) => createReturnRequest(userId, orderId, reason),
    onSuccess: (
      data: any,
      variables: { userId: string; orderId: string; reason: string }
    ) => {
      queryClient.invalidateQueries({
        queryKey: orderKeys.detail(variables.orderId, variables.userId)
      })
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() })
    }
  })
}

export const useUserCancelOrder = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      userId,
      status,
      orderId
    }: {
      userId: string
      status: string
      orderId: string
    }) => userCancelOrder(userId, status, orderId),
    onSuccess: (
      data: any,
      variables: { userId: string; status: string; orderId: string }
    ) => {
      queryClient.invalidateQueries({
        queryKey: orderKeys.detail(variables.orderId, variables.userId)
      })
      queryClient.invalidateQueries({
        queryKey: orderKeys.list(variables.userId, {})
      })
    }
  })
}

export const useSellerUpdateOrderStatus = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      userId,
      status,
      orderId,
      storeId
    }: {
      userId: string
      status: string
      orderId: string
      storeId: string
    }) => sellerUpdateStatusOrder(userId, status, orderId, storeId),
    onSuccess: (
      data: any,
      variables: {
        userId: string
        status: string
        orderId: string
        storeId: string
      }
    ) => {
      queryClient.invalidateQueries({
        queryKey: orderKeys.storeDetail(
          variables.orderId,
          variables.storeId,
          variables.userId
        )
      })
      queryClient.invalidateQueries({
        queryKey: orderKeys.storeList(variables.storeId, variables.userId, {})
      })
    }
  })
}

export const useSellerUpdateReturnStatus = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      userId,
      status,
      orderId,
      storeId
    }: {
      userId: string
      status: string
      orderId: string
      storeId: string
    }) => sellerUpdateReturnStatusOrder(userId, status, orderId, storeId),
    onSuccess: (
      data: any,
      variables: {
        userId: string
        status: string
        orderId: string
        storeId: string
      }
    ) => {
      queryClient.invalidateQueries({
        queryKey: orderKeys.returnList(variables.storeId, variables.userId, {})
      })
      queryClient.invalidateQueries({
        queryKey: orderKeys.storeDetail(
          variables.orderId,
          variables.storeId,
          variables.userId
        )
      })
    }
  })
}
