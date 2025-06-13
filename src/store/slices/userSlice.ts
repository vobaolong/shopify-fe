import { createSlice } from '@reduxjs/toolkit'
import { LevelType, UserType } from '../../@types/entity.types'

export interface UserState {
  user: {
    createdAt?: string
    level?: LevelType
    role?: string
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
