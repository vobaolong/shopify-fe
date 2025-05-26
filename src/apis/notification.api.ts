import axiosClient from './client.api'

export const getNotifications = async (userId: string): Promise<any> => {
  return axiosClient.get(`/notification/${userId}`)
}

export const updateRead = async (userId: string): Promise<any> => {
  return axiosClient.put(`/notification/${userId}/read`)
}

export const sendBanStoreEmail = async (
  userId: string,
  storeId: string
): Promise<any> => {
  return axiosClient.post(`/notification/send/ban-store/${userId}/${storeId}`)
}

export const sendCreateStoreEmail = async (
  userId: string,
  storeId: string
): Promise<any> => {
  return axiosClient.post(
    `/notification/send/create-store/${userId}/${storeId}`
  )
}

export const sendActiveStoreEmail = async (
  userId: string,
  storeId: string
): Promise<any> => {
  return axiosClient.post(
    `/notification/send/active-store/${userId}/${storeId}`
  )
}

export const sendActiveProductEmail = async (userId: string): Promise<any> => {
  return axiosClient.post(`/notification/send/active-product/${userId}`)
}

export const sendBanProductEmail = async (userId: string): Promise<any> => {
  return axiosClient.post(`/notification/send/ban-product/${userId}`)
}

export const deleteNotifications = async (userId: string): Promise<any> => {
  return axiosClient.delete(`/notification/${userId}`)
}
