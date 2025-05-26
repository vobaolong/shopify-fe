import axiosClient from './client.api'

export const listFollowingStores = async (userId: string, params: any) => {
  return await axiosClient.get(`/following/stores/${userId}`, {
    params
  })
}

export const getStoreFollowerCount = async (storeId: string) => {
  return await axiosClient.get(`/store/follower-count/${storeId}`)
}

export const checkFollowingStore = async (userId: string, storeId: string) => {
  return await axiosClient.get(`/check/following/stores/${storeId}/${userId}`)
}

export const followStore = async (userId: string, storeId: string) => {
  return await axiosClient.get(`/follow/store/${storeId}/${userId}`)
}

export const unfollowStore = async (userId: string, storeId: string) => {
  return await axiosClient.delete(`/unfollow/store/${storeId}/${userId}`)
}
