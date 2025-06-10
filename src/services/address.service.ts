import * as addressApi from '../apis/address.api'
import { AddressDetail, Province, District, Ward } from '../@types/address.type'

export interface AddressCreateData {
  provinceID: string
  provinceName: string
  districtID: string
  districtName: string
  wardID: string
  wardName: string
  street: string
}

export interface AddressResponse {
  _id: string
  provinceID: string
  provinceName: string
  districtID: string
  districtName: string
  wardID: string
  wardName: string
  address: string
  createdAt: Date
  updatedAt: Date
}

export interface AddressFormattedData {
  id: string
  fullAddress: string
  province: { id: string; name: string }
  district: { id: string; name: string }
  ward: { id: string; name: string }
  street: string
}

class AddressService {
  /**
   * Tạo address mới
   */
  async createAddress(data: AddressCreateData): Promise<AddressResponse> {
    const fullAddress = this.formatFullAddress(
      data.street,
      data.wardName,
      data.districtName,
      data.provinceName
    )

    const payload = {
      provinceID: data.provinceID,
      provinceName: data.provinceName,
      districtID: data.districtID,
      districtName: data.districtName,
      wardID: data.wardID,
      wardName: data.wardName,
      address: fullAddress
    }

    const response = await addressApi.createAddress(payload)
    return response.data.address
  }

  /**
   * Lấy address theo ID
   */
  async getAddressById(id: string): Promise<AddressResponse> {
    const response = await addressApi.getAddressById(id)
    return response.data.address
  }

  /**
   * Lấy danh sách addresses với phân trang
   */
  async getAddresses(page = 1, limit = 10) {
    const response = await addressApi.getAddresses(page, limit)
    return response.data
  }

  /**
   * Cập nhật address
   */
  async updateAddress(
    id: string,
    data: Partial<AddressCreateData>
  ): Promise<AddressResponse> {
    const payload: any = {}

    if (data.provinceID) payload.provinceID = data.provinceID
    if (data.provinceName) payload.provinceName = data.provinceName
    if (data.districtID) payload.districtID = data.districtID
    if (data.districtName) payload.districtName = data.districtName
    if (data.wardID) payload.wardID = data.wardID
    if (data.wardName) payload.wardName = data.wardName

    if (
      data.street ||
      data.wardName ||
      data.districtName ||
      data.provinceName
    ) {
      payload.address = this.formatFullAddress(
        data.street || '',
        data.wardName || '',
        data.districtName || '',
        data.provinceName || ''
      )
    }

    const response = await addressApi.updateAddress(id, payload)
    return response.data.address
  }

  /**
   * Xóa address
   */
  async deleteAddress(id: string): Promise<void> {
    await addressApi.deleteAddress(id)
  } /**
   * Lấy danh sách tỉnh/thành phố
   */
  async getProvinces(search?: string): Promise<Province[]> {
    try {
      const response: any = await addressApi.getProvinces(search)
      console.log('Provinces API response:', response)

      // The GHN API returns provinces directly with ProvinceID and ProvinceName
      if (response.provinces && Array.isArray(response.provinces)) {
        return response.provinces.filter((p: any) => p.ProvinceName) // Filter out any invalid entries
      }

      throw new Error('Invalid response structure')
    } catch (error) {
      console.error('Error fetching provinces:', error)
      throw new Error('Không thể tải danh sách tỉnh/thành phố')
    }
  } /**
   * Lấy danh sách quận/huyện theo provinceID
   */
  async getDistricts(provinceId: string): Promise<District[]> {
    if (!provinceId) {
      throw new Error('Province ID is required')
    }

    try {
      console.log('Fetching districts for province:', provinceId)
      const response: any = await addressApi.getDistricts(provinceId)
      console.log('Districts API response:', response)

      if (!response || !response.districts) {
        console.error('Invalid response structure:', response)
        throw new Error('Invalid API response')
      }

      // The GHN API returns districts directly with DistrictID and DistrictName
      return response.districts.filter((d: any) => d.DistrictName) // Filter out any invalid entries
    } catch (error) {
      console.error('Error fetching districts:', error)
      throw new Error('Không thể tải danh sách quận/huyện')
    }
  }
  /**
   * Lấy danh sách xã/phường theo districtID
   */
  async getWards(districtId: string): Promise<Ward[]> {
    if (!districtId) {
      throw new Error('District ID is required')
    }

    try {
      console.log('Fetching wards for district:', districtId)
      const response: any = await addressApi.getWards(districtId)
      console.log('Wards API response:', response)

      if (!response || !response.wards) {
        console.error('Invalid response structure:', response)
        throw new Error('Invalid API response')
      }

      // The GHN API returns wards directly with WardCode and WardName
      return response.wards.filter((w: any) => w.WardName) // Filter out any invalid entries
    } catch (error) {
      console.error('Error fetching wards:', error)
      throw new Error('Không thể tải danh sách xã/phường')
    }
  }

  /**
   * Parse địa chỉ từ object hoặc string
   */
  parseAddress(address: any): string {
    if (typeof address === 'string') {
      return address
    }

    if (address && typeof address === 'object') {
      if (address.provinceName || address.districtName || address.wardName) {
        return this.formatFullAddress(
          address.address || '',
          address.wardName || '',
          address.districtName || '',
          address.provinceName || ''
        )
      }

      if (address.address) {
        return address.address
      }
    }

    return 'Đang cập nhật...'
  }

  /**
   * Validate dữ liệu address
   */
  validateAddress(data: Partial<AddressCreateData>): {
    isValid: boolean
    errors: string[]
  } {
    const errors: string[] = []

    if (!data.provinceID) errors.push('Vui lòng chọn tỉnh/thành phố')
    if (!data.districtID) errors.push('Vui lòng chọn quận/huyện')
    if (!data.wardID) errors.push('Vui lòng chọn xã/phường')
    if (!data.street?.trim()) errors.push('Vui lòng nhập địa chỉ cụ thể')

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  /**
   * Format địa chỉ đầy đủ
   */
  formatFullAddress(
    street: string,
    ward: string,
    district: string,
    province: string
  ): string {
    const parts = [street, ward, district, province].filter(
      (part) => part && part.trim() !== ''
    )
    return parts.join(', ')
  }

  /**
   * Format dữ liệu cho form
   */
  formatForForm(address: AddressResponse): AddressFormattedData {
    return {
      id: address._id,
      fullAddress: address.address,
      province: {
        id: address.provinceID,
        name: address.provinceName
      },
      district: {
        id: address.districtID,
        name: address.districtName
      },
      ward: {
        id: address.wardID,
        name: address.wardName
      },
      street: this.extractStreetFromFullAddress(
        address.address,
        address.wardName,
        address.districtName,
        address.provinceName
      )
    }
  }

  /**
   * Tách street address từ full address
   */
  private extractStreetFromFullAddress(
    fullAddress: string,
    ward: string,
    district: string,
    province: string
  ): string {
    let street = fullAddress

    if (province && street.includes(province)) {
      street = street.replace(`, ${province}`, '').replace(province, '')
    }
    if (district && street.includes(district)) {
      street = street.replace(`, ${district}`, '').replace(district, '')
    }
    if (ward && street.includes(ward)) {
      street = street.replace(`, ${ward}`, '').replace(ward, '')
    }

    return street.replace(/^,\s*/, '').replace(/,\s*$/, '').trim()
  }

  /**
   * Get display address helper (cho component)
   */
  getDisplayAddress(address: any): string {
    if (!address) return 'Chưa có địa chỉ'

    if (typeof address === 'string') {
      return address || 'Chưa có địa chỉ'
    }

    if (typeof address === 'object') {
      if (address._id || address.toString().match(/^[0-9a-fA-F]{24}$/)) {
        return 'Đang tải địa chỉ...'
      }

      if (
        address.provinceName ||
        address.districtName ||
        address.wardName ||
        address.address
      ) {
        const parts = []
        if (address.address) parts.push(address.address)
        if (address.wardName) parts.push(address.wardName)
        if (address.districtName) parts.push(address.districtName)
        if (address.provinceName) parts.push(address.provinceName)

        return parts.filter(Boolean).join(', ') || 'Chưa có địa chỉ'
      }
    }

    return 'Chưa có địa chỉ'
  }
}

export default new AddressService()
