import { message } from 'antd'
import axiosClient from './axiosClient'
import axios from 'axios'

// Giao Hàng Nhanh (GHN) API config
export const getProvinceGHN = process.env.VITE_GHN_API_PROVINCE
export const getDistrictGHN = process.env.VITE_GHN_API_DISTRICT
export const getWardGHN = process.env.VITE_GHN_API_WARD
// Token GHN
export const GHN_TOKEN = process.env.VITE_GHN_TOKEN

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
	} catch (error) {
		message.error('Error fetching provinces from GHN:', error)
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
	} catch (error) {
		message.error('Error fetching districts from GHN:', error)
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
	} catch (error) {
		message.error('Error fetching wards from GHN:', error)
		return []
	}
}

// API gọi từ backend
export const getAddress = async (address: string) => {
	try {
		const res = await axiosClient.get(`/address/${address}`)
		return res
	} catch (error) {
		message.error(error)
		return []
	}
}

export const getProvinces = async () => {
	try {
		const res = await axiosClient.get('/provinces')
		return res
	} catch (error) {
		message.error(error)
		return []
	}
}
