import client from './client.api'

export const getCartCount = async (userId: string): Promise<any> => {
  return await client.get(`/user/${userId}/cart/count`)
}

export const addToCart = async (
  userId: string,
  cartItem: any
): Promise<any> => {
  return await client.post(`/user/${userId}/cart`, cartItem)
}

export const listCarts = async (userId: string, params: any): Promise<any> => {
  return await client.get(`/user/${userId}/cart`, {
    params
  })
}

export const listItemsByCart = async (
  userId: string,
  cartId: string
): Promise<any> => {
  return await client.get(`/user/${userId}/cart/${cartId}/items`)
}

export const deleteFromCart = async (
  userId: string,
  cartItemId: string
): Promise<any> => {
  return await client.delete(`/user/${userId}/cart/item/${cartItemId}`)
}

export const updateCartItem = async (
  userId: string,
  count: number,
  cartItemId: string
): Promise<any> => {
  return await client.put(`/user/${userId}/cart/item/${cartItemId}`, count)
}
