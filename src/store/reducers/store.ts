const initialState = {
	store: {}
}

const storeReducer = (state = initialState, action: any) => {
	switch (action.type) {
		case 'ADD_STORE': {
			const store = action.payload
			return {
				...state,
				store: store
			}
		}
		case 'UPDATE_IS_FOLLOWING': {
			const isFollowing = action.payload
			return {
				...state,
				store: {
					...state.store,
					isFollowing
				}
			}
		}
		case 'UPDATE_LEVEL': {
			const level = action.payload
			return {
				...state,
				store: {
					...state.store,
					level
				}
			}
		}
		default: {
			return state
		}
	}
}

export default storeReducer
