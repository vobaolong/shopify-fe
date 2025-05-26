import axiosClient from './client.api'

//user follow product
export const listFavoriteProducts = async (userId: string, params: any) => {
  return await axiosClient.get(`/favorite/products/${userId}`, {
    params
  })
}

export const getFavoriteCount = async (productId: string) => {
  return await axiosClient.get(`/product/favorite-count/${productId}`)
}

export const checkFavoriteProduct = async (
  userId: string,
  productId: string
) => {
  return await axiosClient.get(
    `/check/favorite/products/${productId}/${userId}`
  )
}

export const favoriteProduct = async (userId: string, productId: string) => {
  return await axiosClient.get(`/favorite/product/${productId}/${userId}`)
}

export const unFavoriteProduct = async (userId: string, productId: string) => {
  return await axiosClient.delete(`/unfavorite/product/${productId}/${userId}`)
}
