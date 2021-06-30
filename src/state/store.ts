import { configureStore } from '@reduxjs/toolkit'
import galleryReducer from "./gallerySlice"
export default configureStore({
    reducer: {
        gallery: galleryReducer
    }
})