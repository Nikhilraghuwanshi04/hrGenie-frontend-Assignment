import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { documentApi } from '../../../services/api';

interface DocumentState {
    _id: string | null;
    content: string;
    title: string;
    collaborators: string[];
    documents: Array<{ _id: string; title: string }>; // List for sidebar
    isLoading: boolean;
    error: string | null;
    activeUsers: string[];
}

const initialState: DocumentState = {
    _id: null,
    content: '',
    title: 'Untitled Document',
    collaborators: [],
    documents: [],
    isLoading: false,
    error: null,
    activeUsers: [],
};

// Async Thunks
export const createDocument = createAsyncThunk(
    'document/create',
    async (title: string, { rejectWithValue }) => {
        try {
            // Generate a client-side ID to satisfy backend requirement
            const _id = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(7);
            const response = await documentApi.create(title, _id);
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to create document');
        }
    }
);

export const getDocument = createAsyncThunk(
    'document/get',
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await documentApi.get(id);
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to fetch document');
        }
    }
);

export const getAllDocuments = createAsyncThunk(
    'document/list',
    async (_, { rejectWithValue }) => {
        try {
            const response = await documentApi.list();
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to fetch documents');
        }
    }
);

export const updateDocument = createAsyncThunk(
    'document/update',
    async ({ id, title }: { id: string; title: string }, { rejectWithValue }) => {
        try {
            // Use the specific rename endpoint as requested by user
            const response = await documentApi.rename(id, title);
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to rename document');
        }
    }
);

export const deleteDocument = createAsyncThunk(
    'document/delete',
    async (id: string, { rejectWithValue }) => {
        try {
            await documentApi.delete(id);
            return id;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to delete document');
        }
    }
);

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
        setActiveUsers: (state, action: PayloadAction<string[]>) => {
            state.activeUsers = action.payload;
        },
        resetDocument: (state) => {
            state._id = null;
            state.content = '';
            state.title = 'Untitled Document';
            state.collaborators = [];
        }
    },
    extraReducers: (builder) => {
        builder
            // Create
            .addCase(createDocument.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createDocument.fulfilled, (state, action) => {
                state.isLoading = false;
                state._id = action.payload._id;
                state.title = action.payload.title;
                // Ensure content is string
                state.content = typeof action.payload.data === 'string' ? action.payload.data : '';
            })
            .addCase(createDocument.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Get
            .addCase(getDocument.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getDocument.fulfilled, (state, action) => {
                state.isLoading = false;
                state._id = action.payload._id;
                state.title = action.payload.title;
                state.content = typeof action.payload.data === 'string' ? action.payload.data : '';
            })
            .addCase(getDocument.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;

                if (action.meta.arg) {
                    state.documents = state.documents.filter(doc => doc._id !== action.meta.arg);
                }
            })
            // List
            .addCase(getAllDocuments.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getAllDocuments.fulfilled, (state, action) => {
                state.isLoading = false;
                state.documents = action.payload;
            })
            .addCase(getAllDocuments.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Update
            .addCase(updateDocument.fulfilled, (state, action) => {
                const index = state.documents.findIndex((doc) => doc._id === action.payload._id);
                if (index !== -1) {
                    state.documents[index].title = action.payload.title;
                }
                if (state._id === action.payload._id) {
                    state.title = action.payload.title;
                }
            })
            // Delete
            .addCase(deleteDocument.fulfilled, (state, action) => {
                state.documents = state.documents.filter((doc) => doc._id !== action.payload);
                if (state._id === action.payload) {
                    state._id = null;
                    state.title = 'Untitled Document';
                    state.content = '';
                }
            });
    },
});

export const { setContent, setTitle, setCollaborators, resetDocument, setActiveUsers } = documentSlice.actions;

export default documentSlice.reducer;
