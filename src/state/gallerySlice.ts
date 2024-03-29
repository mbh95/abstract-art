import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface GalleryState {
    art: ArtState[];
    settings: SettingsState;
}

export interface SettingsState {
    highDpiSupport: boolean;
}

const defaultSettings: SettingsState = {
    highDpiSupport: true,
};

export interface ArtState {
    textSource: string;
    selected: boolean;
}

export function createArtState(textSource: string): ArtState {
    return {
        textSource,
        selected: false,
    }
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

export interface SelectArtActionPayload {
    index: number;
}

export interface UpdateSettingsActionPayload {
    newSettings: SettingsState;
}

export const gallerySlice = createSlice({
    name: 'gallery',
    initialState: { art: [] as ArtState[], settings: defaultSettings } as GalleryState,
    reducers: {
        addArt: (state, event: PayloadAction<AddArtActionPayload>) => {
            state.art.push(createArtState(event.payload.newSource));
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
        toggleSelected: (state, event: PayloadAction<SelectArtActionPayload>) => {
            state.art[event.payload.index].selected = !state.art[event.payload.index].selected;
        },
        updateSettings: (state, event: PayloadAction<UpdateSettingsActionPayload>) => {
            state.settings = event.payload.newSettings;
        },
    }
})

export const { addArt, editArt, setAllArt, deleteArt, toggleSelected, updateSettings } = gallerySlice.actions
export const selectArt = (state: { gallery: GalleryState }) => state.gallery.art;
export const selectSettings = (state: { gallery: GalleryState }) => state.gallery.settings;

export default gallerySlice.reducer