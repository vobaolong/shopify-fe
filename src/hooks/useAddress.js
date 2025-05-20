import { useQuery } from '@tanstack/react-query'
import {
  getAddress,
  getProvinces,
  getDistricts,
  getWards
} from '../apis/address'

// Query keys
export const addressKeys = {
  all: ['address'],
  cache: (address) => [...addressKeys.all, 'cache', address],
  provinces: () => [...addressKeys.all, 'provinces'],
  districts: (provinceId) => [...addressKeys.all, 'districts', provinceId],
  wards: (districtId) => [...addressKeys.all, 'wards', districtId]
}

// Hooks
export const useAddressCache = (address) => {
  return useQuery({
    queryKey: addressKeys.cache(address),
    queryFn: () => getAddress(address),
    enabled: !!address
  })
}

export const useProvinces = () => {
  return useQuery({
    queryKey: addressKeys.provinces(),
    queryFn: () => getProvinces(),
    staleTime: 24 * 60 * 60 * 1000 // 24 hours - provinces rarely change
  })
}

export const useDistricts = (provinceId) => {
  return useQuery({
    queryKey: addressKeys.districts(provinceId),
    queryFn: () => getDistricts(provinceId),
    enabled: !!provinceId,
    staleTime: 24 * 60 * 60 * 1000 // 24 hours
  })
}

export const useWards = (districtId) => {
  return useQuery({
    queryKey: addressKeys.wards(districtId),
    queryFn: () => getWards(districtId),
    enabled: !!districtId,
    staleTime: 24 * 60 * 60 * 1000 // 24 hours
  })
}
