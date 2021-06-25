import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {parse} from "../compiler/parser";
import Expression, {randomExpression} from "../compiler/expression";

export interface ArtState {
    index: number;
    selected: boolean;
    textSource: string;
}

export interface GenerationState {
    pieces: ArtState[]
}

const createArt = (index: number, textSource: string) => {
    return {
        index,
        selected: false,
        textSource,
    }
};

const GENERATION_SIZE = 6;

const createFirstGeneration = () => {
    const pieces: ArtState[] = [];
    for (let i = 0; i < GENERATION_SIZE; i++) {
        pieces.push(createArt(i, randomExpression(10).toString()));
    }
    console.log(pieces);
    return {
        pieces
    };
}
const createNextGeneration = (prevGeneration: GenerationState) => {
    console.log("STARTING");
    const selected: Expression[] = prevGeneration.pieces.filter(art => art.selected)
        .map(art => {
            try {
                return parse(art.textSource)
            } catch (e) {
                return undefined
            }
        })
        .filter(exp => exp !== undefined)
        .map(exp => exp!);
    if (selected.length === 0) {
        throw new Error("No parents selected");
    }
    const children: ArtState[] = [];
    for (let i = 0; i < GENERATION_SIZE; i++) {
        const parent1 = selected[Math.floor(Math.random() * selected.length)];
        const parent2 = selected[Math.floor(Math.random() * selected.length)];
        let child = parent1.cross(parent2);
        // 1 to 5 mutations
        for (let m = 0; m < Math.floor(Math.random()*5) + 1; m++) {
            child = child.mutate();
        }
        children.push(createArt(i, child.toString()));
    }

    return {
        pieces: children
    };
}

export interface SelectActionPayload {
    index: number;
}

export interface EditActionPayload {
    index: number;
    newSource: string;
}

export const artSlice = createSlice({
    name: 'art',
    initialState: createFirstGeneration() as GenerationState,
    reducers: {
        random: (state) => createFirstGeneration(),
        nextGeneration: (state) => {try {return createNextGeneration(state);} catch(e) {return state;}},
        edit: (state, event: PayloadAction<EditActionPayload>) => {
            state.pieces[event.payload.index].textSource = event.payload.newSource;
        },
        toggleSelected: (state, event: PayloadAction<SelectActionPayload>) => {
            state.pieces[event.payload.index].selected = !state.pieces[event.payload.index].selected;
        }
    }
})

export const {random, nextGeneration, edit, toggleSelected} = artSlice.actions
export const selectedPieces = (state: { art: GenerationState }) => state.art.pieces;

export default artSlice.reducer