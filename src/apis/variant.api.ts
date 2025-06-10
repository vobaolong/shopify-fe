import axiosClient from './client.api'

export const getVariantById = async (variantId: any) => {
  return await axiosClient.get(`/admin/variant/${variantId}`)
}

export const listVariants = async (params: any): Promise<any> => {
  return await axiosClient.get(`/admin/variants`, {
    params
  })
}

export const listVariantByCategory = async (
  categoryId: string
): Promise<any> => {
  return await axiosClient.get('/variants/active', {
    params: {
      categoryId,
      limit: 100
    }
  })
}

export const listActiveVariants = async (params: any): Promise<any> => {
  return await axiosClient.get('/variants/active', {
    params
  })
}

export const createVariant = async (variant: any): Promise<any> => {
  return await axiosClient.post(`/admin/variant`, variant)
}

export const updateVariant = async (
  variantId: string,
  variant: any
): Promise<any> => {
  return await axiosClient.put(`/admin/variant/${variantId}`, variant)
}

export const removeVariant = async (variantId: string): Promise<any> => {
  return await axiosClient.delete(`/admin/variant/${variantId}`)
}

export const restoreVariant = async (variantId: string): Promise<any> => {
  return await axiosClient.get(`/admin/variant/${variantId}/restore`)
}

export const listActiveValues = async (
  variantId: string,
  params?: any
): Promise<any> => {
  return await axiosClient.get(`/active/values/by/variant/${variantId}`, {
    params
  })
}

export const listValues = async (
  variantId: string,
  params?: any
): Promise<any> => {
  return await axiosClient.get(`/values/by/variant/${variantId}`, {
    params
  })
}

export const getValueById = async (valueId: string): Promise<any> => {
  return await axiosClient.get(`/value/${valueId}`)
}

export const createValue = async (value: any): Promise<any> => {
  return await axiosClient.post(`/value`, value)
}

export const updateValue = async (
  valueId: string,
  value: any
): Promise<any> => {
  return await axiosClient.put(`/value/${valueId}`, value)
}

export const removeValue = async (valueId: string): Promise<any> => {
  return await axiosClient.delete(`/value/${valueId}`)
}

export const restoreValue = async (valueId: string): Promise<any> => {
  return await axiosClient.get(`/value/restore/${valueId}`)
}
