import client from './client.api'

export const addWishlist = (userId: string, productId: string) => {
  return client.post(`/wishlist/add/${userId}/${productId}`)
}

export const unWishlist = (userId: string, productId: string) => {
  return client.delete(`/wishlist/remove/${userId}/${productId}`)
}

export const checkWishlist = (userId: string, productId: string) => {
  return client.get(`/wishlist/check/${userId}/${productId}`)
}

export const listWishlist = (userId: string, filter: any): Promise<any> => {
  return client.get(`/wishlist/products/${userId}`, { params: filter })
}

export const clearWishlist = (userId: string) => {
  return client.delete(`/wishlist/clear/${userId}`)
}

export const getWishlistCount = (productId: string) => {
  return client.get(`/wishlist/count/${productId}`)
}
