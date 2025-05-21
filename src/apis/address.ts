import axiosClient from './axiosClient'
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
	try {
		const res = await axiosClient.get(`/address/${address}`)
		return res
	} catch (error: any) {
		console.error('Error fetching address:', error)
		return []
	}
}

export const getProvinces = async () => {
	try {
		const res = await axiosClient.get('/provinces')
		return res
	} catch (error: any) {
		console.error('Error fetching provinces:', error)
		return []
	}
}
