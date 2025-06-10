import axiosClient, { axiosClientImg } from './client.api'

export const getProduct = async (productId: string): Promise<any> => {
  return await axiosClient.get(`/product/${productId}`)
}

export const getProductByIdForManager = async (
  userId: string,
  productId: string,
  storeId: string
): Promise<any> => {
  return await axiosClient.get(
    `/product/for/manager/${productId}/${storeId}/${userId}`
  )
}

//list product
export const listActiveProducts = async (params: any): Promise<any> => {
  return await axiosClient.get('/products/active', {
    params
  })
}

export const listSellingProductsByStore = async (
  params: any,
  storeId: string
): Promise<any> => {
  return await axiosClient.get(`/selling/products/store/${storeId}`, {
    params
  })
}

export const listProductsForManager = async (
  params: any,
  storeId: string
): Promise<any> => {
  return await axiosClient.get(`/store/${storeId}/products`, {
    params
  })
}

export const listProductsForAdmin = async (params: any): Promise<any> => {
  return axiosClient.get('/admin/products', { params })
}

//sell-store product
export const sellingProduct = async (
  userId: string,
  value: any,
  storeId: string,
  productId: string
): Promise<any> => {
  return await axiosClient.put(
    `/product/selling/${productId}/${storeId}/${userId}`,
    value
  )
}

export const activeProduct = async (
  value: any,
  productId: string
): Promise<any> => {
  return axiosClient.put(`/admin/active-product/${productId}`, value)
}

export const banProduct = async (
  userId: string,
  value: any,
  productId: string
): Promise<any> => {
  return await axiosClient.put(`/product/ban/${productId}/${userId}`, value)
}

export const createProduct = async (
  userId: string,
  product: any,
  storeId: string
): Promise<any> => {
  return await axiosClientImg.post(
    `/product/create/${storeId}/${userId}`,
    product
  )
}

export const updateProduct = async (
  userId: string,
  product: any,
  productId: string,
  storeId: string
): Promise<any> => {
  return await axiosClientImg.put(
    `/product/update/${productId}/${storeId}/${userId}`,
    product
  )
}

//list listImages
export const addListImages = async (
  userId: string,
  photo: any,
  productId: string,
  storeId: string
): Promise<any> => {
  return await axiosClientImg.post(
    `/store/${storeId}/user/${userId}/product/${productId}/images`,
    photo
  )
}

export const updateListImages = async (
  userId: string,
  photo: any,
  index: number,
  productId: string,
  storeId: string
): Promise<any> => {
  return await axiosClientImg.put(
    `/store/${storeId}/user/${userId}/product/${productId}/images`,
    photo,
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
  return await axiosClient.delete(
    `/store/${storeId}/user/${userId}/product/${productId}/images`,
    {
      params: { index }
    }
  )
}
