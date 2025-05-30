import { createSlice } from '@reduxjs/toolkit'

interface AccountState {
  user: {
    id?: string
    name?: string
    avatar?: string
    cartCount?: number
    role?: string
    [key: string]: any
  }
}

const initialState: AccountState = {
  user: {}
}

const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    addAccount: (state, action) => {
      state.user = action.payload
    },
    updateAvatar: (state, action) => {
      state.user = { ...state.user, avatar: action.payload }
    }
  }
})

export const { addAccount, updateAvatar } = accountSlice.actions

export default accountSlice.reducer

// Selector
export const selectAccountUser = (state: { account: AccountState }) =>
  state.account.user
