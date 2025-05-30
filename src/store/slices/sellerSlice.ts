import { createSlice } from '@reduxjs/toolkit'

interface SellerState {
  store: {
    id?: string
    name?: string
    [key: string]: any
  }
}

const initialState: SellerState = {
  store: {}
}

const sellerSlice = createSlice({
  name: 'seller',
  initialState,
  reducers: {
    addSeller: (state, action) => {
      state.store = action.payload
    }
  }
})

export const { addSeller } = sellerSlice.actions

export default sellerSlice.reducer

// Selector
export const selectSellerStore = (state: { seller: SellerState }) =>
  state.seller.store
