import { createSlice } from '@reduxjs/toolkit'

const initialState = {
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
