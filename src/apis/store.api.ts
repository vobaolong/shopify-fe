import axiosClient, { axiosClientImg } from './client.api'

export const getStoreProfile = async (storeId: string): Promise<any> => {
  return await axiosClient.get(`/store/profile/${storeId}`)
}

export const updateProfile = async (
  store: any,
  storeId: string
): Promise<any> => {
  return await axiosClient.put(`/store/${storeId}`, store)
}

export const getStore = async (storeId: string): Promise<any> => {
  return await axiosClient.get(`/store/${storeId}`)
}

export const getListStores = async (params: any): Promise<any> => {
  return await axiosClient.get('/stores', {
    params
  })
}

export const getStoresByUser = async (
  userId: string,
  params: any
): Promise<any> => {
  return await axiosClient.get(`/user/stores/${userId}`, {
    params
  })
}

export const getStoresForAdmin = async (params: any): Promise<any> => {
  return axiosClient.get('/admin/stores', { params })
}

export const createStore = async (userId: string, store: any): Promise<any> => {
  return await axiosClientImg.post(`/store/${userId}`, store)
}

export const updateAvatar = async (
  userId: string,
  photo: any,
  storeId: string
): Promise<any> => {
  return await axiosClientImg.put(`/store/avatar/${storeId}/${userId}`, photo)
}

export const updateCover = async (
  userId: string,
  photo: any,
  storeId: string
): Promise<any> => {
  return await axiosClientImg.put(`/store/cover/${storeId}/${userId}`, photo)
}

export const addFeaturedImage = async (
  userId: string,
  photo: any,
  storeId: string
): Promise<any> => {
  return await axiosClientImg.post(
    `/store/featured/image/${storeId}/${userId}`,
    photo
  )
}

export const updateFeaturedImage = async (
  userId: string,
  photo: any,
  index: number,
  storeId: string
): Promise<any> => {
  return await axiosClientImg.put(
    `/store/featured/image/${storeId}/${userId}`,
    photo,
    {
      params: { index }
    }
  )
}

export const removeFeaturedImage = async (
  userId: string,
  index: number,
  storeId: string
): Promise<any> => {
  return await axiosClient.delete(
    `/store/featured/image/${storeId}/${userId}`,
    {
      params: { index }
    }
  )
}

export const addStaff = async (
  userId: string,
  staff: any,
  storeId: string
): Promise<any> => {
  return await axiosClient.post(`/store/staff/${storeId}/${userId}`, {
    staff
  })
}

export const deleteStaff = async (
  userId: string,
  staff: any,
  storeId: string
): Promise<any> => {
  return await axiosClient.delete(`/store/staff/remove/${storeId}/${userId}`, {
    data: { staff }
  })
}

export const cancelStaff = async (
  userId: string,
  storeId: string
): Promise<any> => {
  return await axiosClient.delete(`/store/staff/cancel/${storeId}/${userId}`)
}

export const openStore = async (
  userId: string,
  value: any,
  storeId: string
): Promise<any> => {
  return await axiosClient.put(`/store/open/${storeId}/${userId}`, value)
}

export const activeStore = async (
  storeId: string,
  params: any
): Promise<any> => {
  return axiosClient.put(`/admin/store-active/${storeId}`, params)
}

export const addAddress = async (
  userId: string,
  address: any
): Promise<any> => {
  return await axiosClient.post(`/user/address/${userId}`, address)
}

export const updateAddress = async (
  userId: string,
  index: number,
  address: any
): Promise<any> => {
  return await axiosClient.put(`/user/address/${userId}`, address, {
    params: { index }
  })
}
