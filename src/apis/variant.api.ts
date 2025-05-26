import axiosClient from './client.api'

export const getVariantById = async (userId: string, variantId: string) => {
  return await axiosClient.get(`/variant/by/id/${variantId}/${userId}`)
}

export const listVariants = async (userId: string, params: any) => {
  return await axiosClient.get(`/variants/${userId}`, {
    params
  })
}

export const listVariantByCategory = async (categoryId: string) => {
  return await axiosClient.get('/active/variants', {
    params: {
      categoryId,
      limit: 100
    }
  })
}

export const listActiveVariants = async (params: any) => {
  return await axiosClient.get('/active/variants', {
    params
  })
}

export const createVariant = async (userId: string, variant: any) => {
  return await axiosClient.post(`/variant/create/${userId}`, variant)
}

export const updateVariant = async (
  userId: string,
  variantId: string,
  variant: any
) => {
  return await axiosClient.put(`/variant/${variantId}/${userId}`, variant)
}

export const removeVariant = async (userId: string, variantId: string) => {
  return await axiosClient.delete(`/variant/${variantId}/${userId}`)
}

export const restoreVariant = async (userId: string, variantId: string) => {
  return await axiosClient.get(`/variant/restore/${variantId}/${userId}`)
}

export const listActiveValues = async (variantId: string) => {
  return await axiosClient.get(`/active/variant/values/by/variant/${variantId}`)
}

export const listValues = async (userId: string, variantId: string) => {
  return await axiosClient.get(
    `/variant/values/by/variant/${variantId}/${userId}`
  )
}

export const getValueById = async (userId: string, valueId: string) => {
  return await axiosClient.get(`/value/by/id/${valueId}/${userId}`)
}

export const createValue = async (userId: string, value: any) => {
  return await axiosClient.post(`/value/create/${userId}`, value)
}

export const updateValue = async (
  userId: string,
  valueId: string,
  value: any
) => {
  return await axiosClient.put(`/value/${valueId}/${userId}`, value)
}

export const removeValue = async (userId: string, valueId: string) => {
  return await axiosClient.delete(`/value/${valueId}/${userId}`)
}

export const restoreValue = async (userId: string, valueId: string) => {
  return await axiosClient.get(`/value/restore/${valueId}/${userId}`)
}
