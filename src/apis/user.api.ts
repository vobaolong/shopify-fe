import { getToken, refreshTokenApi } from './auth.api'
import { jwtDecode } from 'jwt-decode'
import axiosClient, { axiosClientImg } from './client.api'

export const getUser = async (userId: string) => {
  return await axiosClient.get(`/user/${userId}`)
}

export const getListUsers = async (params: any) => {
  return await axiosClient.get('/users', {
    params
  })
}

export const listUserForAdmin = async (params: any): Promise<any> => {
  return axiosClient.get('/admin/users', { params })
}

export const getUserByToken = async () => {
  const token = getToken()
  if (token) {
    const decoded = jwtDecode(token) as { id: string }
    return await axiosClient.get(`/user/${decoded.id}`)
  }
  return null
}

export const updateUserInfo = async (userId: string, user: any) => {
  return await axiosClient.put(`/user/${userId}`, user)
}

export const updateProfile = async (userId: string, user: any) => {
  return await axiosClient.put(`/user/profile/${userId}`, user)
}

export const updateCover = async (userId: string, photo: any) => {
  return await axiosClient.put(`/user/cover/${userId}`, photo)
}

export const updatePassword = async (userId: string, user: any) => {
  return await axiosClient.put(`/user/password/${userId}`, user)
}

export const addStaff = async (userId: string, staff: any) => {
  return await axiosClient.post(`/admin/staff/add/${userId}`, staff)
}

export const addAddress = async (userId: string, address: any) => {
  return await axiosClient.post(`/user/address/${userId}`, address)
}

export const addSeller = async (userId: string, seller: any) => {
  return await axiosClient.post(`/admin/seller/add/${userId}`, seller)
}

export const lockUserAccount = async (userId: string, staffId: string) => {
  return await axiosClient.put(`/admin/user/lock/${staffId}/${userId}`)
}

export const unlockUserAccount = async (userId: string, staffId: string) => {
  return await axiosClient.put(`/admin/user/unlock/${staffId}/${userId}`)
}

export const uploadUserAvatar = async (userId: string, formData: any) => {
  return await axiosClientImg.post(`/user/avatar/${userId}`, formData)
}

export const uploadCoverImage = async (userId: string, formData: any) => {
  return await axiosClientImg.post(`/user/cover/${userId}`, formData)
}

export const getUserProfile = async (
  userId: string,
  token: string | null = null
) => {
  if (token) {
    const { refreshToken, _id, role } = getToken()
    const decoded = jwtDecode(token)
    const timeout = ((decoded.exp as number) - 60) * 1000 - Date.now().valueOf()
    setTimeout(() => refreshTokenApi(refreshToken, _id, role), timeout)
  }
  return await axiosClient.get(`/user/profile/${userId}`)
}

export const deleteAddresses = async (userId: string, index: number) => {
  return await axiosClient.delete(`/user/address/${userId}`, {
    params: { index }
  })
}

export const updateAddress = async (
  userId: string,
  index: number,
  address: any
) => {
  return await axiosClient.put(`/user/address/${userId}`, address, {
    params: { index }
  })
}
