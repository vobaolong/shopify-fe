const initialState = {
	store: {}
}

const sellerReducer = (state = initialState, action: any) => {
	switch (action.type) {
		case 'ADD_SELLER': {
			const store = action.payload
			return {
				...state,
				store: store
			}
		}

		default: {
			return state
		}
	}
}

export default sellerReducer
