import { createSlice } from '@reduxjs/toolkit'

interface ProductState {
  product: {
    id?: string
    name?: string
    [key: string]: any
  }
}

const initialState: ProductState = {
  product: {}
}

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    addProduct: (state, action) => {
      state.product = action.payload
    }
  }
})

export const { addProduct } = productSlice.actions

export default productSlice.reducer

// Selector
export const selectProductProduct = (state: { product: ProductState }) =>
  state.product.product
