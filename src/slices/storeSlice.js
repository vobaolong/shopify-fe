import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  store: {}
}

const storeSlice = createSlice({
  name: 'store',
  initialState,
  reducers: {
    addStore: (state, action) => {
      state.store = action.payload
    },
    updateIsFollowing: (state, action) => {
      state.store.isFollowing = action.payload
    },
    updateLevel: (state, action) => {
      state.store.level = action.payload
    }
  }
})

export const { addStore, updateIsFollowing, updateLevel } = storeSlice.actions

export default storeSlice.reducer
