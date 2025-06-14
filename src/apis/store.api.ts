import client, { clientImg } from './client.api'

export const getStoreProfile = async (storeId: string): Promise<any> => {
  return await client.get(`/store/profile/${storeId}`)
}

export const updateProfile = async (
  store: any,
  storeId: string
): Promise<any> => {
  return await client.put(`/store/${storeId}`, store)
}

export const getStore = async (storeId: string): Promise<any> => {
  return await client.get(`/store/${storeId}`)
}

export const getListStores = async (params: any): Promise<any> => {
  return await client.get('/stores', {
    params
  })
}

export const getStoresByUser = async (
  userId: string,
  params: any
): Promise<any> => {
  return await client.get(`/user/stores/${userId}`, {
    params
  })
}

export const getStoresForAdmin = async (params: any): Promise<any> => {
  return client.get('/admin/stores', { params })
}

export const createStore = async (userId: string, store: any): Promise<any> => {
  return await clientImg.post(`/store/${userId}`, store)
}

export const updateAvatar = async (
  storeId: string,
  image: any
): Promise<any> => {
  return await clientImg.put(`/store/avatar/${storeId}`, image)
}

export const updateCover = async (
  image: any,
  storeId: string
): Promise<any> => {
  return await clientImg.put(`/store/cover/${storeId}`, image)
}

export const addFeaturedImage = async (
  image: any,
  storeId: string
): Promise<any> => {
  return await clientImg.post(`/store/featured/image/${storeId}`, image)
}

export const updateFeaturedImage = async (
  image: any,
  index: number,
  storeId: string
): Promise<any> => {
  return await clientImg.put(`/store/featured/image/${storeId}`, image, {
    params: { index }
  })
}

export const removeFeaturedImage = async (
  index: number,
  storeId: string
): Promise<any> => {
  return await client.delete(`/store/featured/image/${storeId}`, {
    params: { index }
  })
}

export const addStaff = async (staff: any, storeId: string): Promise<any> => {
  return await client.post(`/store/staff/${storeId}`, {
    staff
  })
}

export const deleteStaff = async (
  staff: any,
  storeId: string
): Promise<any> => {
  return await client.delete(`/store/staff/remove/${storeId}`, {
    data: { staff }
  })
}

export const cancelStaff = async (
  userId: string,
  storeId: string
): Promise<any> => {
  return await client.delete(`/store/staff/cancel/${storeId}/${userId}`)
}

export const openStore = async (
  userId: string,
  value: any,
  storeId: string
): Promise<any> => {
  return await client.put(`/store/open/${storeId}/${userId}`, value)
}

export const activeStore = async (
  storeId: string,
  params: any
): Promise<any> => {
  return client.put(`/admin/store-active/${storeId}`, params)
}

export const addAddress = async (
  userId: string,
  address: any
): Promise<any> => {
  return await client.post(`/user/address/${userId}`, address)
}

export const updateAddress = async (
  userId: string,
  index: number,
  address: any
): Promise<any> => {
  return await client.put(`/user/address/${userId}`, address, {
    params: { index }
  })
}
