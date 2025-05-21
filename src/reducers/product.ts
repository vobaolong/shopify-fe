const initialState = {
	product: {}
}

const productReducer = (state = initialState, action: any) => {
	switch (action.type) {
		case 'ADD_PRODUCT': {
			const product = action.payload
			return {
				...state,
				product: product
			}
		}

		default: {
			return state
		}
	}
}

export default productReducer
