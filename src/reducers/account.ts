const initialState = {
	user: {}
}

const accountReducer = (state = initialState, action: any) => {
	switch (action.type) {
		case 'ADD_ACCOUNT': {
			const user = action.payload
			return {
				...state,
				user: user
			}
		}
		case 'UPDATE_AVATAR': {
			const avatar = action.payload
			return {
				...state,
				user: {
					...state.user,
					avatar
				}
			}
		}

		default: {
			return state
		}
	}
}

export default accountReducer
