import axiosClient from './client.api'

export const getBrandById = async (brandId: string) => {
  return axiosClient.get(`/brand/${brandId}`)
}

export const listBrands = async (params: any) => {
  return axiosClient.get('/admin/brands', {
    params
  })
}

export const listActiveBrands = async (params: any) => {
  return axiosClient.get('/brands/active', {
    params
  })
}

export const listBrandByCategory = async (categoryId: string) => {
  return axiosClient.get('/brands/active', {
    params: {
      categoryId
    }
  })
}

export const createBrand = async (brand: any) => {
  return axiosClient.post(`/admin/brand`, brand)
}

export const updateBrand = async (brandId: string, brand: any) => {
  return axiosClient.put(`/admin/brand/${brandId}`, brand)
}

export const removeBrand = async (brandId: string) => {
  return axiosClient.delete(`/admin/brand/${brandId}`)
}

export const restoreBrand = async (brandId: string) => {
  return axiosClient.get(`/admin/brand/${brandId}/restore`)
}

export const checkBrandNameExist = async (name: string) => {
  return axiosClient.get(`/admin/brand/check-name`, { params: { name } })
}
