import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface DocumentState {
    content: string;
    title: string;
    collaborators: string[]; // List of connected user IDs or names
    isLoading: boolean;
    error: string | null;
}

const initialState: DocumentState = {
    content: '',
    title: 'Untitled Document',
    collaborators: [],
    isLoading: false,
    error: null,
};

export const documentSlice = createSlice({
    name: 'document',
    initialState,
    reducers: {
        setContent: (state, action: PayloadAction<string>) => {
            state.content = action.payload;
        },
        setTitle: (state, action: PayloadAction<string>) => {
            state.title = action.payload;
        },
        setCollaborators: (state, action: PayloadAction<string[]>) => {
            state.collaborators = action.payload;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
    },
});

export const { setContent, setTitle, setCollaborators, setLoading, setError } = documentSlice.actions;

export default documentSlice.reducer;
