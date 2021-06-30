import {createSlice, PayloadAction} from '@reduxjs/toolkit'

export interface GalleryState {
    art: ArtState[];
}

export interface ArtState {
    textSource: string;
}

export interface AddArtActionPayload {
    newSource: string;
}

export interface EditArtActionPayload {
    index: number;
    newSource: string;
}

export interface SetAllArtActionPayload {
    newArt: ArtState[];
}

export interface DeleteArtActionPayload {
    index: number;
}

export const gallerySlice = createSlice({
    name: 'gallery',
    initialState: {art: [] as ArtState[]} as GalleryState,
    reducers: {
        addArt: (state, event: PayloadAction<AddArtActionPayload>) => {
            state.art.push({textSource: event.payload.newSource});
        },
        editArt: (state, event: PayloadAction<EditArtActionPayload>) => {
            state.art[event.payload.index].textSource = event.payload.newSource;
        },
        setAllArt: (state, event: PayloadAction<SetAllArtActionPayload>) => {
            state.art = event.payload.newArt;
        },
        deleteArt: (state, event: PayloadAction<DeleteArtActionPayload>) => {
            state.art.splice(event.payload.index, 1);
        },
    }
})

export const {addArt, editArt, setAllArt, deleteArt} = gallerySlice.actions
export const selectArt = (state: { gallery: GalleryState }) => state.gallery.art;

export default gallerySlice.reducer