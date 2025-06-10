import axiosClient from './client.api'
import axios from 'axios'
// Giao Hàng Nhanh (GHN) API config
export const getProvinceGHN = import.meta.env.VITE_GHN_API_PROVINCE
export const getDistrictGHN = import.meta.env.VITE_GHN_API_DISTRICT
export const getWardGHN = import.meta.env.VITE_GHN_API_WARD
export const GHN_TOKEN = import.meta.env.VITE_GHN_TOKEN
export const getProvince = import.meta.env.VITE_API_PROVINCE
export const getDistrict = import.meta.env.VITE_API_DISTRICT
export const getWard = import.meta.env.VITE_API_WARD

// Hàm gọi API GHN
export const getProvincesGHN = async () => {
  try {
    if (!getProvinceGHN || !GHN_TOKEN) {
      throw new Error('Missing GHN API configuration')
    }
    const { data } = await axios.get(getProvinceGHN, {
      headers: {
        Token: GHN_TOKEN
      }
    })
    return data.data || []
  } catch (error: any) {
    console.error('Error fetching provinces from GHN:', error)
    return []
  }
}

export const getDistrictsGHN = async (provinceId: string) => {
  try {
    if (!getDistrictGHN || !GHN_TOKEN) {
      throw new Error('Missing GHN API configuration')
    }
    const { data } = await axios.get(getDistrictGHN, {
      headers: {
        Token: GHN_TOKEN
      },
      params: {
        province_id: provinceId
      }
    })
    return data.data || []
  } catch (error: any) {
    console.error('Error fetching districts from GHN:', error)
    return []
  }
}

export const getWardsGHN = async (districtId: string) => {
  try {
    if (!getWardGHN || !GHN_TOKEN) {
      throw new Error('Missing GHN API configuration')
    }
    const { data } = await axios.get(getWardGHN, {
      headers: {
        Token: GHN_TOKEN
      },
      params: {
        district_id: districtId
      }
    })
    return data.data || []
  } catch (error: any) {
    console.error('Error fetching wards from GHN:', error)
    return []
  }
}

export const getAddress = async (address: string) => {
  return await axiosClient.get(`/address/${address}`)
}

export const getAddressById = async (id: string) => {
  return await axiosClient.get(`/address/id/${id}`)
}

export const getAddresses = async (page = 1, limit = 10) => {
  return await axiosClient.get(`/addresses?page=${page}&limit=${limit}`)
}

export const createAddress = async (addressData: {
  provinceID: string
  provinceName?: string
  districtID: string
  districtName?: string
  wardID: string
  wardName?: string
  address: string
}) => {
  return await axiosClient.post('/address', addressData)
}

export const updateAddress = async (
  id: string,
  addressData: {
    provinceID?: string
    provinceName?: string
    districtID?: string
    districtName?: string
    wardID?: string
    wardName?: string
    address?: string
  }
) => {
  return await axiosClient.put(`/address/${id}`, addressData)
}

export const deleteAddress = async (id: string) => {
  return await axiosClient.delete(`/address/${id}`)
}

export const getProvinces = async (search?: string, page = 1, limit = 100) => {
  const params = new URLSearchParams()
  if (search) params.append('search', search)
  params.append('page', page.toString())
  params.append('limit', limit.toString())

  return await axiosClient.get(`/provinces?${params.toString()}`)
}

export const getDistricts = async (provinceId: string, search?: string) => {
  const params = new URLSearchParams()
  if (search) params.append('search', search)

  return await axiosClient.get(
    `/provinces/${provinceId}/districts?${params.toString()}`
  )
}

export const getWards = async (districtId: string, search?: string) => {
  const params = new URLSearchParams()
  if (search) params.append('search', search)

  return await axiosClient.get(
    `/districts/${districtId}/wards?${params.toString()}`
  )
}
