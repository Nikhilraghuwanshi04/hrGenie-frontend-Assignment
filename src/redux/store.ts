import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import documentReducer from './features/document/documentSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        document: documentReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
