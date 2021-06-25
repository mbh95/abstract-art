import { configureStore } from '@reduxjs/toolkit'
import artReducer from './artSlice'

export default configureStore({
    reducer: {
        art: artReducer
    }
})