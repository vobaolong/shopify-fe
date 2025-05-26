import { useQuery } from '@tanstack/react-query'
import {
  getAddress,
  getProvinces,
  getDistrictsGHN,
  getWardsGHN
} from '../apis/address.api'

// Query keys
type AddressType = string | number
export const addressKeys = {
  all: ['address'],
  cache: (address: AddressType) => [...addressKeys.all, 'cache', address],
  provinces: () => [...addressKeys.all, 'provinces'],
  districts: (provinceId: AddressType) => [
    ...addressKeys.all,
    'districts',
    provinceId
  ],
  wards: (districtId: AddressType) => [...addressKeys.all, 'wards', districtId]
}

// Hooks
export const useAddressCache = (address: AddressType) => {
  return useQuery({
    queryKey: addressKeys.cache(address),
    queryFn: () => getAddress(String(address)),
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

export const useDistricts = (provinceId: AddressType) => {
  return useQuery({
    queryKey: addressKeys.districts(provinceId),
    queryFn: () => getDistrictsGHN(String(provinceId)),
    enabled: !!provinceId,
    staleTime: 24 * 60 * 60 * 1000 // 24 hours
  })
}

export const useWards = (districtId: AddressType) => {
  return useQuery({
    queryKey: addressKeys.wards(districtId),
    queryFn: () => getWardsGHN(String(districtId)),
    enabled: !!districtId,
    staleTime: 24 * 60 * 60 * 1000 // 24 hours
  })
}
