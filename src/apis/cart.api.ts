import axiosClient from './client.api'

export const getCartCount = async (userId: string) => {
  return await axiosClient.get(`/user/${userId}/cart/count`)
}

export const addToCart = async (userId: string, cartItem: any) => {
  return await axiosClient.post(`/user/${userId}/cart`, cartItem)
}

export const listCarts = async (userId: string, params: any) => {
  return await axiosClient.get(`/user/${userId}/cart`, {
    params
  })
}

export const listItemsByCart = async (userId: string, cartId: string) => {
  return await axiosClient.get(`/user/${userId}/cart/${cartId}/items`)
}

export const deleteFromCart = async (userId: string, cartItemId: string) => {
  return await axiosClient.delete(`/user/${userId}/cart/item/${cartItemId}`)
}

export const updateCartItem = async (
  userId: string,
  count: number,
  cartItemId: string
) => {
  return await axiosClient.put(`/user/${userId}/cart/item/${cartItemId}`, count)
}
