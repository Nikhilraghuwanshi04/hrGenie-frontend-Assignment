import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { authApi, User } from '../../../services/api';

interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
    token: string | null;
    loading: boolean;
    error: string | null;
}

// 1. Check local storage for token and user initialization
const getInitialToken = () => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('token');
    }
    return null;
};

const getInitialUser = () => {
    if (typeof window !== 'undefined') {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                return JSON.parse(userStr);
            } catch (e) {
                console.error("Failed to parse user from local storage", e);
                return null;
            }
        }
    }
    return null;
};

const initialState: AuthState = {
    isAuthenticated: !!getInitialToken(),
    user: getInitialUser(),
    token: getInitialToken(),
    loading: false,
    error: null,
};

// Async Thunks
export const login = createAsyncThunk(
    'auth/login',
    async (credentials: any, { rejectWithValue }) => {
        try {
            const response = await authApi.login(credentials);
            const { token, ...user } = response.data;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Login failed');
        }
    }
);

export const signup = createAsyncThunk(
    'auth/signup',
    async (credentials: any, { rejectWithValue }) => {
        try {
            const response = await authApi.signup(credentials);
            const { token, ...user } = response.data;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Signup failed');
        }
    }
);

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        },
    },
    extraReducers: (builder) => {
        builder
            // Login
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                const { token, ...user } = action.payload;
                state.user = user as User; // backend flat response means payload IS user + token
                state.token = token;
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Signup
            .addCase(signup.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(signup.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                const { token, ...user } = action.payload;
                state.user = user as User;
                state.token = token;
            })
            .addCase(signup.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
