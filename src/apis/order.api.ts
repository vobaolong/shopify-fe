import axiosClient from './client.api'

export const getOrderByUser = async (
  userId: string,
  orderId: string
): Promise<any> => {
  return await axiosClient.get(`/order/user/${orderId}/${userId}`)
}

export const createReturnRequest = async (
  userId: string,
  orderId: string,
  reason: string
): Promise<any> => {
  return await axiosClient.post(`/order/return/${orderId}/${userId}`, {
    reason
  })
}

export const getOrderByStore = async (
  orderId: string,
  storeId: string
): Promise<any> => {
  return await axiosClient.get(`/store/${storeId}/order/${orderId}`)
}

export const getOrderForAdmin = async (orderId: string): Promise<any> => {
  return await axiosClient.get(`/admin/order/${orderId}`)
}

export const createOrder = async (
  userId: string,
  cartId: string,
  order: any
): Promise<any> => {
  return await axiosClient.post(`/order/create/${cartId}/${userId}`, order)
}

export const listItemsByOrder = async (
  userId: string,
  orderId: string
): Promise<any> => {
  return await axiosClient.get(`/order/user/${userId}/${orderId}/items`)
}

export const listItemsByOrderByStore = async (
  userId: string,
  orderId: string,
  storeId: string
): Promise<any> => {
  return await axiosClient.get(
    `/order/items/by/store/${orderId}/${storeId}/${userId}`
  )
}

export const listItemsByOrderForAdmin = async (
  orderId: string
): Promise<any> => {
  return await axiosClient.get(`/admin/order/${orderId}/items`)
}

export const listOrdersByUser = async (
  userId: string,
  params: any
): Promise<any> => {
  return await axiosClient.get(`/order/user/${userId}`, {
    params
  })
}

export const listOrdersByStore = async (
  userId: string,
  params: any,
  storeId: string
): Promise<any> => {
  return await axiosClient.get(`/orders/by/store/${storeId}/${userId}`, {
    params
  })
}

export const listReturnByStore = async (
  userId: string,
  filter: any,
  storeId: string
): Promise<any> => {
  return await axiosClient.get(`/order/return/by/store/${storeId}/${userId}`, {
    params: filter
  })
}

export const listOrdersForAdmin = async (params: any): Promise<any> => {
  return axiosClient.get('/admin/orders', { params })
}

export const userCancelOrder = async (
  userId: string,
  status: string,
  orderId: string
): Promise<any> => {
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
): Promise<any> => {
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
): Promise<any> => {
  return await axiosClient.post(
    `/order/return/${orderId}/${storeId}/${userId}/approve`,
    { status }
  )
}

export const countOrder = async (
  status: string,
  userId: string,
  storeId: string
): Promise<any> => {
  return await axiosClient.get('/order/count', {
    params: {
      status,
      userId,
      storeId
    }
  })
}
