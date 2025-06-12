import client from './client.api'

export const wishlist = (userId: string, productId: string) => {
  return client.post(`/user/wishlist/add/${userId}/${productId}`)
}

export const unWishlist = (userId: string, productId: string) => {
  return client.delete(`/user/wishlist/remove/${userId}/${productId}`)
}

export const checkWishlist = (userId: string, productId: string) => {
  return client.get(`/user/wishlist/check/${userId}/${productId}`)
}

export const listWishlist = (userId: string, filter: any) => {
  return client.get(`/user/wishlist/list/${userId}`, { params: filter })
}

export const clearWishlist = (userId: string) => {
  return client.delete(`/user/wishlist/clear/${userId}`)
}

export const getWishlistCount = (userId: string) => {
  return client.get(`/user/wishlist/count/${userId}`)
}
