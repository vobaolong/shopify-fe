export const addProduct = (product: any) => {
  return {
    type: 'ADD_PRODUCT',
    payload: product
  }
}
