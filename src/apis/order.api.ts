import axiosClient from './client.api'

export const getOrderByUser = async (userId: string, orderId: string) => {
  return await axiosClient.get(`/order/by/user/${orderId}/${userId}`)
}

export const createReturnRequest = async (
  userId: string,
  orderId: string,
  reason: string
) => {
  return await axiosClient.post(`/order/return/${orderId}/${userId}`, {
    reason
  })
}

export const getOrderByStore = async (orderId: string, storeId: string) => {
  return await axiosClient.get(`/store/${storeId}/order/${orderId}`)
}

export const getOrderForAdmin = async (orderId: string) => {
  return await axiosClient.get(`/admin/order/${orderId}`)
}

export const createOrder = async (
  userId: string,
  cartId: string,
  order: any
) => {
  return await axiosClient.post(`/order/create/${cartId}/${userId}`, order)
}

export const listItemsByOrder = async (userId: string, orderId: string) => {
  return await axiosClient.get(`/order/items/by/user/${orderId}/${userId}`)
}

export const listItemsByOrderByStore = async (
  userId: string,
  orderId: string,
  storeId: string
) => {
  return await axiosClient.get(
    `/order/items/by/store/${orderId}/${storeId}/${userId}`
  )
}

export const listItemsByOrderForAdmin = async (orderId: string) => {
  return await axiosClient.get(`/admin/order/${orderId}/items`)
}

export const listOrdersByUser = async (userId: string, filter: any) => {
  const { search, sortBy, order, limit, page, status } = filter
  return await axiosClient.get(`/orders/by/user/${userId}`, {
    params: {
      search,
      status,
      sortBy,
      order,
      limit,
      page
    }
  })
}

export const listOrdersByStore = async (
  userId: string,
  filter: any,
  storeId: string
) => {
  const { search, sortBy, order, limit, page, status } = filter
  return await axiosClient.get(`/orders/by/store/${storeId}/${userId}`, {
    params: {
      search,
      status,
      sortBy,
      order,
      limit,
      page
    }
  })
}

export const listReturnByStore = async (
  userId: string,
  filter: any,
  storeId: string
) => {
  const { search, sortBy, order, limit, page, status } = filter
  return await axiosClient.get(`/order/return/by/store/${storeId}/${userId}`, {
    params: {
      search,
      status,
      sortBy,
      order,
      limit,
      page
    }
  })
}

export const listOrdersForAdmin = async (params: any) => {
  return axiosClient.get('/admin/orders', { params })
}

export const userCancelOrder = async (
  userId: string,
  status: string,
  orderId: string
) => {
  return await axiosClient.put(
    `/order/update/by/user/${orderId}/${userId}`,
    status
  )
}

export const sellerUpdateStatusOrder = async (
  userId: string,
  status: string,
  orderId: string,
  storeId: string
) => {
  return await axiosClient.put(
    `/order/update/by/store/${orderId}/${storeId}/${userId}`,
    status
  )
}

export const sellerUpdateReturnStatusOrder = async (
  userId: string,
  status: string,
  orderId: string,
  storeId: string
) => {
  return await axiosClient.post(
    `/order/return/${orderId}/${storeId}/${userId}/approve`,
    { status }
  )
}

export const countOrder = async (
  status: string,
  userId: string,
  storeId: string
) => {
  return await axiosClient.get('/orders/count', {
    params: {
      status,
      userId,
      storeId
    }
  })
}
