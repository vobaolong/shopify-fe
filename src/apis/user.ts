import { getToken, refreshTokenApi } from './auth'
import { jwtDecode } from 'jwt-decode'
import axiosClient, { axiosClientImg } from './client'

export const getUser = async (userId: string) => {
  try {
    const res = await axiosClient.get(`/user/${userId}`)
    return res
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const getListUsers = async (filter: any) => {
  const { search, sortBy, order, limit, page, role } = filter

  try {
    const res = await axiosClient.get('/users', {
      params: {
        search,
        role,
        sortBy,
        order,
        limit,
        page
      }
    })
    return res
  } catch (error) {
    console.log(error)
    throw error
  }
}

type UsersResponse = { size: number; users: any[]; filter: any }
export const listUserForAdmin = async (params: any): Promise<UsersResponse> => {
  return axiosClient.get('/admin/users', { params })
}

export const getUserByToken = async () => {
  try {
    const token = getToken()
    if (token) {
      const decoded = jwtDecode(token) as { id: string }
      const res = await axiosClient.get(`/user/${decoded.id}`)
      return res
    }
    return null
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const updateUserInfo = async (userId: string, user: any) => {
  try {
    const res = await axiosClient.put(`/user/${userId}`, user)
    return res
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const updateProfile = async (userId: string, user: any) => {
  try {
    const res = await axiosClient.put(`/user/profile/${userId}`, user)
    return res
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const updateCover = async (userId: string, photo: any) => {
  try {
    const res = await axiosClient.put(`/user/cover/${userId}`, photo)
    return res
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const updatePassword = async (userId: string, user: any) => {
  try {
    const res = await axiosClient.put(`/user/password/${userId}`, user)
    return res
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const addStaff = async (userId: string, staff: any) => {
  try {
    const res = await axiosClient.post(`/admin/staff/add/${userId}`, staff)
    return res
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const addAddress = async (userId: string, address: any) => {
  try {
    const res = await axiosClient.post(`/user/address/${userId}`, address)
    return res
  } catch (error) {
    return console.log(error)
  }
}

export const addSeller = async (userId: string, seller: any) => {
  try {
    const res = await axiosClient.post(`/admin/seller/add/${userId}`, seller)
    return res
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const lockUserAccount = async (userId: string, staffId: string) => {
  try {
    const res = await axiosClient.put(`/admin/user/lock/${staffId}/${userId}`)
    return res
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const unlockUserAccount = async (userId: string, staffId: string) => {
  try {
    const res = await axiosClient.put(`/admin/user/unlock/${staffId}/${userId}`)
    return res
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const uploadUserAvatar = async (userId: string, formData: any) => {
  try {
    const res = await axiosClientImg.post(`/user/avatar/${userId}`, formData)
    return res
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const uploadCoverImage = async (userId: string, formData: any) => {
  try {
    const res = await axiosClient.post(`/user/cover/${userId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return res
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const getUserProfile = async (
  userId: string,
  token: string | null = null
) => {
  try {
    if (token) {
      const { refreshToken, _id, role } = getToken()
      const decoded = jwtDecode(token)
      const timeout =
        ((decoded.exp as number) - 60) * 1000 - Date.now().valueOf()
      setTimeout(() => refreshTokenApi(refreshToken, _id, role), timeout)
    }

    const res = await axiosClient.get(`/user/profile/${userId}`)
    return res
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const deleteAddresses = async (userId: string, index: number) => {
  try {
    const res = await axiosClient.delete(`/user/address/${userId}`, {
      params: { index }
    })
    return res
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const updateAddress = async (
  userId: string,
  index: number,
  address: any
) => {
  try {
    const res = await axiosClient.put(`/user/address/${userId}`, address, {
      params: { index }
    })
    return res
  } catch (error) {
    console.log(error)
    throw error
  }
}
