export interface Province {
  ProvinceID: string
  ProvinceName: string
}
export interface District {
  DistrictID: string
  DistrictName: string
}
export interface Ward {
  WardCode: string
  WardName: string
}
export interface AddressDetail {
  provinceID?: string
  provinceName?: string
  districtID?: string
  districtName?: string
  wardCode?: string
  wardName?: string
  address?: string
}
