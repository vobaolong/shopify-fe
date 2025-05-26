import axiosClient from './client.api'

//user level
export const getUserLevel = async (userId: string) => {
  return await axiosClient.get(`/user/level/${userId}`)
}

export const listUserLevels = async (userId: string, params: any) => {
  return await axiosClient.get(`/user/levels/${userId}`, {
    params
  })
}

export const createUserLevel = async (userLevel: any) => {
  return await axiosClient.post(`/admin/user-level`, userLevel)
}

export const updateUserLevel = async (userLevelId: string, userLevel: any) => {
  return await axiosClient.put(`/admin/user-level/${userLevelId}`, userLevel)
}

export const removeUserLevel = async (userLevelId: string) => {
  return await axiosClient.delete(`/admin/user-level/${userLevelId}`)
}

export const restoreUserLevel = async (userLevelId: string) => {
  return await axiosClient.get(`/admin/user-level/restore/${userLevelId}`)
}

//store level
export const getStoreLevel = async (storeId: string) => {
  return await axiosClient.get(`/store/level/${storeId}`)
}

export const listStoreLevels = async (userId: string, params: any) => {
  return await axiosClient.get(`/store/levels/${userId}`, {
    params
  })
}

export const getStoreLevelById = async (
  userId: string,
  storeLevelId: string
) => {
  return await axiosClient.get(`/store/level/by/id/${storeLevelId}/${userId}`)
}

export const createStoreLevel = async (storeLevel: any) => {
  return await axiosClient.post('/store/level-create', storeLevel)
}

export const updateStoreLevel = async (
  storeLevelId: string,
  storeLevel: any
) => {
  return await axiosClient.put(`/store/level/${storeLevelId}`, storeLevel)
}

export const removeStoreLevel = async (storeLevelId: string) => {
  return await axiosClient.delete(`/store/level/${storeLevelId}`)
}

export const restoreStoreLevel = async (storeLevelId: string) => {
  return await axiosClient.get(`/store/level/${storeLevelId}`)
}
