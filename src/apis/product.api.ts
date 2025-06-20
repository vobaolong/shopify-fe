import client, { clientImg } from './client.api'

export const getProduct = async (productId: string): Promise<any> => {
  return await client.get(`/product/${productId}`)
}

export const getProductByIdForManager = async (
  userId: string,
  productId: string,
  storeId: string
): Promise<any> => {
  return await client.get(
    `store/${storeId}/manager/${userId}/product/${productId}`
  )
}

//list product
export const listActiveProducts = async (params: any): Promise<any> => {
  return await client.get('/products/active', {
    params
  })
}

export const listSellingProductsByStore = async (
  params: any,
  storeId: string
): Promise<any> => {
  return await client.get(`/selling/products/store/${storeId}`, {
    params
  })
}

export const listProductsForManager = async (
  params: any,
  storeId: string
): Promise<any> => {
  return await client.get(`/store/${storeId}/products`, {
    params
  })
}

export const listProductsForAdmin = async (params: any): Promise<any> => {
  return client.get('/admin/products', { params })
}

export const sellingProduct = async (
  userId: string,
  value: any,
  storeId: string,
  productId: string
): Promise<any> => {
  return await client.put(
    `/product/selling/${productId}/${storeId}/${userId}`,
    value
  )
}

export const activeProduct = async (
  value: any,
  productId: string
): Promise<any> => {
  return client.put(`/admin/active-product/${productId}`, value)
}

export const banProduct = async (
  userId: string,
  value: any,
  productId: string
): Promise<any> => {
  return await client.put(`/product/ban/${productId}/${userId}`, value)
}

export const createProduct = async (
  userId: string,
  product: any,
  storeId: string
): Promise<any> => {
  return await clientImg.post(`/product/${storeId}/${userId}`, product)
}

export const updateProduct = async (
  userId: string,
  product: any,
  productId: string,
  storeId: string
): Promise<any> => {
  return await clientImg.put(
    `/product/${productId}/${storeId}/${userId}`,
    product
  )
}

//list listImages
export const addListImages = async (
  userId: string,
  image: any,
  productId: string,
  storeId: string
): Promise<any> => {
  return await clientImg.post(
    `/store/${storeId}/user/${userId}/product/${productId}/images`,
    image
  )
}

export const updateListImages = async (
  userId: string,
  image: any,
  index: number,
  productId: string,
  storeId: string
): Promise<any> => {
  return await clientImg.put(
    `/store/${storeId}/user/${userId}/product/${productId}/images`,
    image,
    {
      params: { index }
    }
  )
}

export const removeListImages = async (
  userId: string,
  index: number,
  productId: string,
  storeId: string
): Promise<any> => {
  return await client.delete(
    `/store/${storeId}/user/${userId}/product/${productId}/images`,
    {
      params: { index }
    }
  )
}
