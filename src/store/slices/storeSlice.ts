import { createSlice } from '@reduxjs/toolkit'

interface StoreState {
  store: {
    id?: string
    name?: string
    isFollowing?: boolean
    level?: number
    [key: string]: any
  }
}

const initialState: StoreState = {
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
      state.store = { ...state.store, isFollowing: action.payload }
    },
    updateLevel: (state, action) => {
      state.store = { ...state.store, level: action.payload }
    }
  }
})

export const { addStore, updateIsFollowing, updateLevel } = storeSlice.actions

export default storeSlice.reducer

export const selectStoreStore = (state: { store: StoreState }) =>
  state.store.store
