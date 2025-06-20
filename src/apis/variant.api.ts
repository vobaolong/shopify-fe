import client from './client.api'

export const getVariantById = async (variantId: any) => {
  return await client.get(`/admin/variant/${variantId}`)
}

export const listVariants = async (params: any): Promise<any> => {
  return await client.get(`/admin/variants`, {
    params
  })
}

export const listVariantByCategory = async (
  categoryId: string
): Promise<any> => {
  return await client.get('/variants/active', {
    params: {
      categoryId,
      limit: 100
    }
  })
}

export const listActiveVariants = async (params: any): Promise<any> => {
  return await client.get('/variants/active', {
    params
  })
}

export const createVariant = async (variant: any): Promise<any> => {
  return await client.post(`/admin/variant`, variant)
}

export const updateVariant = async (
  variantId: string,
  variant: any
): Promise<any> => {
  return await client.put(`/admin/variant/${variantId}`, variant)
}

export const removeVariant = async (variantId: string): Promise<any> => {
  return await client.delete(`/admin/variant/${variantId}`)
}

export const restoreVariant = async (variantId: string): Promise<any> => {
  return await client.get(`/admin/variant/${variantId}/restore`)
}

export const listActiveValues = async (
  variantId: string,
  params?: any
): Promise<any> => {
  return await client.get(`/variants/${variantId}/values/active`, {
    params
  })
}

export const listValues = async (
  variantId: string,
  params?: any
): Promise<any> => {
  return await client.get(`/variants/${variantId}/values`, {
    params
  })
}

export const getValueById = async (valueId: string): Promise<any> => {
  return await client.get(`/value/${valueId}`)
}

export const createValue = async (value: any): Promise<any> => {
  return await client.post(`/value`, value)
}

export const updateValue = async (
  valueId: string,
  value: any
): Promise<any> => {
  return await client.put(`/value/${valueId}`, value)
}

export const removeValue = async (valueId: string): Promise<any> => {
  return await client.delete(`/value/${valueId}`)
}

export const restoreValue = async (valueId: string): Promise<any> => {
  return await client.get(`/value/restore/${valueId}`)
}
