import { configureStore } from '@reduxjs/toolkit'
import accountReducer from './slices/accountSlice'
import sellerReducer from './slices/sellerSlice'
import userReducer from './slices/userSlice'
import storeReducer from './slices/storeSlice'
import productReducer from './slices/productSlice'

const store = configureStore({
  reducer: {
    user: userReducer,
    store: storeReducer,
    seller: sellerReducer,
    product: productReducer,
    account: accountReducer
  }
})

export default store
