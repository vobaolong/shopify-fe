import axiosClient, { axiosClientImg } from './client.api'

export const getProduct = async (productId: string) => {
  return await axiosClient.get(`/product/${productId}`)
}

export const getProductByIdForManager = async (
  userId: string,
  productId: string,
  storeId: string
) => {
  return await axiosClient.get(
    `/product/for/manager/${productId}/${storeId}/${userId}`
  )
}

//list product
export const listActiveProducts = async (params: any) => {
  return await axiosClient.get('/active/products', {
    params
  })
}

export const listSellingProductsByStore = async (
  params: any,
  storeId: string
) => {
  return await axiosClient.get(`/selling/products/by/store/${storeId}`, {
    params
  })
}

export const listProductsForManager = async (
  userId: string,
  params: any,
  storeId: string
) => {
  return await axiosClient.get(`/products/by/store/${storeId}/${userId}`, {
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
) => {
  return await axiosClient.put(
    `/product/selling/${productId}/${storeId}/${userId}`,
    value
  )
}

export const activeProduct = async (value: any, productId: string) => {
  return axiosClient.put(`/admin/active-product/${productId}`, value)
}

export const banProduct = async (
  userId: string,
  value: any,
  productId: string
) => {
  return await axiosClient.put(`/product/ban/${productId}/${userId}`, value)
}

export const createProduct = async (
  userId: string,
  product: any,
  storeId: string
) => {
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
) => {
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
) => {
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
) => {
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
) => {
  return await axiosClient.delete(
    `/store/${storeId}/user/${userId}/product/${productId}/images`,
    {
      params: { index }
    }
  )
}
