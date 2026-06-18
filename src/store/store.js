import { configureStore } from '@reduxjs/toolkit'
import userReducer from './userSlice'
import rappersReducer from './rappersSlice'

export const store = configureStore({
  reducer: {
    user: userReducer,
    rappers: rappersReducer
  }
})
