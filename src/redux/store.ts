import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import documentReducer from './features/document/documentSlice';

import { injectStore } from '../services/api';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        document: documentReducer,
    },
});

injectStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
