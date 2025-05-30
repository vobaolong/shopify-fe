import { createSlice } from '@reduxjs/toolkit'

interface UserState {
  user: {
    id?: string
    name?: string
    [key: string]: any
  }
}

const initialState: UserState = {
  user: {}
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    addUser: (state, action) => {
      state.user = action.payload
    }
  }
})

export const { addUser } = userSlice.actions

export default userSlice.reducer

// Selector
export const selectUserUser = (state: { user: UserState }) => state.user.user
