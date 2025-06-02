import axiosClient from './client.api'

export const getBrandById = async (brandId: string): Promise<any> => {
  return axiosClient.get(`/brand/${brandId}`)
}

export const listBrands = async (params: any): Promise<any> => {
  return axiosClient.get('/admin/brands', {
    params
  })
}

export const listActiveBrands = async (params: any): Promise<any> => {
  return axiosClient.get('/brands/active', {
    params
  })
}

export const listBrandByCategory = async (categoryId: string): Promise<any> => {
  return axiosClient.get('/brands/active', {
    params: {
      categoryId
    }
  })
}

export const createBrand = async (brand: any): Promise<any> => {
  return axiosClient.post(`/admin/brand`, brand)
}

export const updateBrand = async (
  brandId: string,
  brand: any
): Promise<any> => {
  return axiosClient.put(`/admin/brand/${brandId}`, brand)
}

export const removeBrand = async (brandId: string): Promise<any> => {
  return axiosClient.delete(`/admin/brand/${brandId}`)
}

export const restoreBrand = async (brandId: string): Promise<any> => {
  return axiosClient.get(`/admin/brand/${brandId}/restore`)
}

export const checkBrandNameExist = async (name: string): Promise<any> => {
  return axiosClient.get(`/admin/brand/check-name`, { params: { name } })
}
