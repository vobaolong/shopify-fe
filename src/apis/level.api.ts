import axiosClient from './client.api'

//user level
export const getUserLevel = async (userId: string): Promise<any> => {
  return await axiosClient.get(`/user/level/${userId}`)
}

export const listUserLevels = async (params: any): Promise<any> => {
  return await axiosClient.get('/admin/user-levels', {
    params
  })
}

export const createUserLevel = async (userLevel: any): Promise<any> => {
  return await axiosClient.post(`/admin/user-level`, userLevel)
}

export const updateUserLevel = async (
  userLevelId: string,
  userLevel: any
): Promise<any> => {
  return await axiosClient.put(`/admin/user-level/${userLevelId}`, userLevel)
}

export const removeUserLevel = async (userLevelId: string): Promise<any> => {
  return await axiosClient.delete(`/admin/user-level/${userLevelId}`)
}

export const restoreUserLevel = async (userLevelId: string): Promise<any> => {
  return await axiosClient.get(`/admin/user-level/restore/${userLevelId}`)
}

//store level
export const getStoreLevel = async (storeId: string): Promise<any> => {
  return await axiosClient.get(`/store/level/${storeId}`)
}

export const listStoreLevels = async (params: any): Promise<any> => {
  return await axiosClient.get(`/admin/store-levels`, {
    params
  })
}

export const getStoreLevelById = async (storeLevelId: string): Promise<any> => {
  return await axiosClient.get(`/store/level/by/id/${storeLevelId}`)
}

export const createStoreLevel = async (storeLevel: any): Promise<any> => {
  return await axiosClient.post('/store/level-create', storeLevel)
}

export const updateStoreLevel = async (
  storeLevelId: string,
  storeLevel: any
): Promise<any> => {
  return await axiosClient.put(`/store/level/${storeLevelId}`, storeLevel)
}

export const removeStoreLevel = async (storeLevelId: string): Promise<any> => {
  return await axiosClient.delete(`/store/level/${storeLevelId}`)
}

export const restoreStoreLevel = async (storeLevelId: string): Promise<any> => {
  return await axiosClient.get(`/store/level/${storeLevelId}`)
}
