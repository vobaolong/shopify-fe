import { createSlice } from '@reduxjs/toolkit'

const initialState = {
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
