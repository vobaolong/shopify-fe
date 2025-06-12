import client from './client.api'

export const getOrderByUser = async (
  userId: string,
  orderId: string
): Promise<any> => {
  return await client.get(`/order/user/${orderId}/${userId}`)
}

export const createReturnRequest = async (
  userId: string,
  orderId: string,
  reason: string
): Promise<any> => {
  return await client.post(`/order/return/${orderId}/${userId}`, {
    reason
  })
}

export const getOrderByStore = async (
  orderId: string,
  storeId: string
): Promise<any> => {
  return await client.get(`/store/${storeId}/order/${orderId}`)
}

export const getOrderForAdmin = async (orderId: string): Promise<any> => {
  return await client.get(`/admin/order/${orderId}`)
}

export const createOrder = async (
  userId: string,
  cartId: string,
  order: any
): Promise<any> => {
  return await client.post(`/order/create/${cartId}/${userId}`, order)
}

export const listItemsByOrder = async (
  userId: string,
  orderId: string
): Promise<any> => {
  return await client.get(`/order/user/${userId}/${orderId}/items`)
}

export const listItemsByOrderByStore = async (
  userId: string,
  orderId: string,
  storeId: string
): Promise<any> => {
  return await client.get(
    `/order/items/by/store/${orderId}/${storeId}/${userId}`
  )
}

export const listItemsByOrderForAdmin = async (
  orderId: string
): Promise<any> => {
  return await client.get(`/admin/order/${orderId}/items`)
}

export const listOrdersByUser = async (
  userId: string,
  params: any
): Promise<any> => {
  return await client.get(`/order/user/${userId}`, {
    params
  })
}

export const listOrdersByStore = async (
  storeId: string,
  params: any
): Promise<any> => {
  return await client.get(`/store/${storeId}/orders`, {
    params
  })
}

export const listReturnByStore = async (
  userId: string,
  filter: any,
  storeId: string
): Promise<any> => {
  return await client.get(`/store/${storeId}/return`, {
    params: {
      userId,
      ...filter
    }
  })
}

export const listOrdersForAdmin = async (params: any): Promise<any> => {
  return client.get('/admin/orders', { params })
}

export const userCancelOrder = async (
  userId: string,
  status: string,
  orderId: string
): Promise<any> => {
  return await client.put(`/order/update/by/user/${orderId}/${userId}`, status)
}

export const sellerUpdateStatusOrder = async (
  userId: string,
  status: string,
  orderId: string,
  storeId: string
): Promise<any> => {
  return await client.put(
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
  return await client.post(
    `/order/return/${orderId}/${storeId}/${userId}/approve`,
    { status }
  )
}

export const countOrder = async (
  status: string,
  userId: string,
  storeId: string
): Promise<any> => {
  return await client.get('/order/count', {
    params: {
      status,
      userId,
      storeId
    }
  })
}
